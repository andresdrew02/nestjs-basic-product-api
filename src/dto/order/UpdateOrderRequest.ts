import { IsIn, IsNotEmpty, ValidateNested } from "class-validator"
import { CreateOrderItemRequest } from "./CreateOrderItemRequest"
import { Type } from "class-transformer"

export class UpdateOrderRequest{
    
    @IsNotEmpty()
    orderId: number

    @IsNotEmpty()
    userId: string

    @IsIn(["pending", "paid", "cancelled", "delivered"])
    status?: string

    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemRequest)
    orderItems: CreateOrderItemRequest[]

    constructor(){}

}