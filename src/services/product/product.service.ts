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
        const data = new UpdateProductData(updateProductRequest.name, updateProductRequest.description, updateProductRequest.price);

        return this.db.product.update({
            where: {
                id: id
            },
            data: data
        })
    }
    
    delete(id: number){
        id = Number(id)
        return this.db.product.delete({where: {id}})
    }
}
