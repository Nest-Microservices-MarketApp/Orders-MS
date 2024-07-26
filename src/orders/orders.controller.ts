import { Controller, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';
import { ResponseDto } from 'src/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const payload = await this.ordersService.create(createOrderDto);

    return new ResponseDto(HttpStatus.CREATED, 'Created', payload);
  }

  @MessagePattern('findAllOrders')
  async findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    const payload = await this.ordersService.findAll(orderPaginationDto);

    return new ResponseDto(HttpStatus.OK, 'Success', payload);
  }

  @MessagePattern('findOneOrder')
  async findOne(@Payload('id', ParseUUIDPipe) id: string) {
    const payload = await this.ordersService.findOne(id);

    return new ResponseDto(HttpStatus.OK, 'Success', payload);
  }

  @MessagePattern('changeOrderStatus')
  async changeStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    const payload = await this.ordersService.changeStatus(changeOrderStatusDto);

    return new ResponseDto(HttpStatus.OK, 'Order status changed', payload);
  }
}
