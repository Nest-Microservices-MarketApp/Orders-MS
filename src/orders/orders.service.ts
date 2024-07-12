import { Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  changeOrderStatus(updateOrderDto: UpdateOrderDto) {
    throw new Error('Method not implemented.');
  }
}
