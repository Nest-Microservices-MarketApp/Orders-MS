import { Controller, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ResponseDto } from 'src/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    const payload = this.ordersService.create(createOrderDto);

    return new ResponseDto(HttpStatus.CREATED, 'Created', payload);
  }

  @MessagePattern('findAllOrders')
  findAll() {
    const payload = this.ordersService.findAll();

    return new ResponseDto(HttpStatus.OK, 'Success', payload);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    const payload = this.ordersService.findOne(id);

    return new ResponseDto(HttpStatus.OK, 'Success', payload);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() updateOrderDto: UpdateOrderDto) {
    const payload = this.ordersService.changeOrderStatus(updateOrderDto);

    return new ResponseDto(HttpStatus.OK, 'Order status changed', payload);
  }
}
