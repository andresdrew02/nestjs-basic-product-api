import { PrismaService } from "src/db/PrismaService";

export class Order{
    constructor(public id: number, public userId: string, public orderDate: Date, public status: string){}

    getOrderItems(){
        return PrismaService.getInstance().getClient().orderItem.findMany({where: {orderId: this.id}})
    }
}