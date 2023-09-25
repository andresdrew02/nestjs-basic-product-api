import { IsNotEmpty, Length, IsOptional, IsNumber, IsPositive } from "class-validator";
import { IsValidId } from "src/validators/IsValidIdConstraint";
import { tableNames } from "src/tableNames";

export class UpdateProductRequest{
    @IsNumber()
    @IsValidId(tableNames.PRODUCTS, { message: 'Not Found' })
    id: number

    @IsNotEmpty()
    @Length(3,50)
    name: string

    @IsOptional()
    @Length(10,100)
    description: string

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    quantity: number

    constructor(){

    }
}