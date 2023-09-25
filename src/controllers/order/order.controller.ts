import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from 'src/services/order/order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @Post()
    //TODO POR AKI
    save(){

    }
}
