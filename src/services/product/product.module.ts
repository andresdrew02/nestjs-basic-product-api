import { ProductController } from "src/controllers/product/product.controller";
import { ProductService } from "./product.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule {}