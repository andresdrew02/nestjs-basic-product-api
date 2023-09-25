import { Body, Controller, Get, Post, Param, Put, Delete, Query } from '@nestjs/common';
import { CreateProductRequest } from 'src/dto/product/CreateProductRequest';
import { UpdateProductRequest } from 'src/dto/product/UpdateProductRequest';
import { ProductService } from 'src/services/product/product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getProducts() {
        return this.productService.findAll();
    }

    @Get('/:id')
    getProductById(@Param('id') id: number){
        return this.productService.findOne(id);
    }

    @Post()
    createProduct(@Body() createProductRequest: CreateProductRequest) {
        return this.productService.save(createProductRequest);
    }

    @Put()
    updateProduct(@Body() updateProductRequest: UpdateProductRequest){
        return this.productService.update(updateProductRequest);
    }

    @Delete('/:id')
    deleteProduct(@Param('id') id: number, @Query('force' ) force: boolean){
        return this.productService.delete(id, force);
    }
}
