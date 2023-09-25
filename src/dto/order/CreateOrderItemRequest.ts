import { IsArray, IsNotEmpty, IsNumber, IsPositive } from "class-validator"

export class CreateOrderItemRequest{
    @IsNotEmpty()
    productId: number

    @IsNumber()
    @IsPositive()
    quantity: number

    constructor(){}
}
