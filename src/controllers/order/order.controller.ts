import { Body, Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { CreateOrderRequest } from 'src/dto/order/CreateOrderRequest';
import { UpdateOrderRequest } from 'src/dto/order/UpdateOrderRequest';
import { OrderService } from 'src/services/order/order.service';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @Post()
    save(@Body() createOrderRequest: CreateOrderRequest){
        return this.orderService.save(createOrderRequest);
    }

    @Put()
    update(@Body() updateOrderRequest: UpdateOrderRequest){
        return this.orderService.update(updateOrderRequest);
    }

    @Delete("/:id")
    delete(@Param('id') id: string){
        return this.orderService.delete(id);

    }
}
