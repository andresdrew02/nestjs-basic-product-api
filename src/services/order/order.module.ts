import { Module } from "@nestjs/common";
import { OrderController } from "src/controllers/order/order.controller";
import { OrderService } from "./order.service";

@Module({
    imports: [],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}