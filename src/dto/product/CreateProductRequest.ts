import { IsNotEmpty, Length, IsOptional, IsNumber, IsPositive } from "class-validator";

export class CreateProductRequest{
    @IsNotEmpty()
    @Length(3,50)
    name: string;

    @IsOptional()
    @Length(10,100)
    description: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    quantity: number;

    constructor() {

    }
}