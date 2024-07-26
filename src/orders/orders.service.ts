import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.order.create({
        data: createOrderDto,
      });

      return order;
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
      });

      if (!order) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Order with id ${id} not found`,
        });
      }

      return order;
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
