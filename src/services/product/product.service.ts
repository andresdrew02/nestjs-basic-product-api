import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/PrismaService';
import { CreateProductRequest } from 'src/dto/product/CreateProductRequest';
import { UpdateProductData } from 'src/dto/product/UpdateProductData';
import { UpdateProductRequest } from 'src/dto/product/UpdateProductRequest';

@Injectable()
export class ProductService {
    private db = PrismaService.getInstance().getClient();
    findAll(){
        return this.db.product.findMany()
    }

    save(createProductRequest: CreateProductRequest){
        return this.db.product.create({data: createProductRequest})
    }

    async findOne(id: number){
        id = Number(id)
        const product = await this.db.product.findFirst({where: {id}})
        return product === null ? new NotFoundException() : product
    }

    update(updateProductRequest: UpdateProductRequest){
        const id = updateProductRequest.id;
        const data = new UpdateProductData(updateProductRequest.name, updateProductRequest.description, updateProductRequest.price, updateProductRequest.quantity);

        return this.db.product.update({
            where: {
                id: id
            },
            data: data
        })
    }
    
    async delete(id: number, force = false){
        id = Number(id)
        if (force){
            await this.db.orderItem.deleteMany({where: {productId: id}})
            return this.db.product.delete({where: {id}})
        }
        return this.db.product.delete({where: {id}})
    }

    static async isQuantityAvailable(productId: number, quantity: number){
        const db = PrismaService.getInstance().getClient();
        const product = await db.product.findFirst({where: {id: productId}})
        return product.quantity >= quantity
    }

    static async getProductById(productId: number){
        const db = PrismaService.getInstance().getClient();
        return await db.product.findFirstOrThrow({ where: { id: productId}})
    }
}
