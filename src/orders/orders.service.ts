import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PRODUCT_SERVICE } from 'src/config';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productsIds = createOrderDto.items.map((item) => item.productId);

      const products: any[] = await firstValueFrom(
        this.productsClient.send('validateId', productsIds),
      );

      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find(
          (product) => product.id === orderItem.productId,
        ).price;

        return price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItems) => ({
                price: products.find(
                  (product) => product.id === orderItems.productId,
                ).price,
                productId: orderItems.productId,
                quantity: orderItems.quantity,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `${err.message}`,
      });
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { status, page, limit } = orderPaginationDto;

    try {
      const totalRecords = await this.order.count({
        where: { status },
      });

      const totalPages = Math.ceil(totalRecords / limit);
      const currentPage = Math.min(page, totalPages);

      const orders = await this.order.findMany({
        where: { status },
        skip: (currentPage - 1) * limit,
        take: limit,
      });

      return {
        data: orders,
        meta: {
          totalRecords,
          totalPages,
          currentPage,
          perPage: limit,
        },
      };
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `${err.message}`,
      });
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.order.findFirst({
        where: { id },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      if (!order) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Order with id ${id} not found`,
        });
      }

      const productsIds = order.OrderItem.map(
        (orderItem) => orderItem.productId,
      );

      const products: any[] = await firstValueFrom(
        this.productsClient.send('validateId', productsIds),
      );

      return {
        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),
      };
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `${err.message}`,
      });
    }
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    try {
      const order = await this.findOne(id);

      if (order.status === status) {
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: `Order is already in ${status} status`,
        });
      }

      const updatedOrder = await this.order.update({
        where: { id },
        data: { status },
      });

      return updatedOrder;
    } catch (err) {
      this.logger.error(err.message);
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `${err.message}`,
      });
    }
  }
}
