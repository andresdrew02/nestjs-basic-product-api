import { IsIn, ValidateNested } from "class-validator"
import { CreateOrderItemRequest } from "./CreateOrderItemRequest"
import { Type } from "class-transformer"

export class CreateOrderRequest{

    @IsIn(["pending", "paid", "cancelled", "delivered"])
    status?: string

    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemRequest)
    orderItems: CreateOrderItemRequest[]

    constructor(){}

}