import { Product } from "./Product"
import { PrismaService } from "src/db/PrismaService"

export class OrderItem{
    constructor(public productId: number, public orderId: number, public quantity: number){}

    getProduct(){
        return PrismaService.getInstance().getClient().product.findFirst({where: {id: this.productId}})
    }

    getOrder(){
        return PrismaService.getInstance().getClient().order.findFirst({where: {id: this.orderId}})
    }
}