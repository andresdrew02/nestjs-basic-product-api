import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/PrismaService';
import { CreateOrderItemRequest } from 'src/dto/order/CreateOrderItemRequest';
import { CreateOrderRequest } from 'src/dto/order/CreateOrderRequest';
import { UpdateOrderRequest } from 'src/dto/order/UpdateOrderRequest';
import { ProductService } from '../product/product.service';
import { Prisma } from '@prisma/client';

type RegularizedOrderItems = {
    productId: number
    quantity: number
}

@Injectable()
export class OrderService {
    private db = PrismaService.getInstance().getClient();
    
    regularizeOrderItems(createOrderItemRequest: CreateOrderItemRequest[]): RegularizedOrderItems[] {
        const regularizedOrderItems: RegularizedOrderItems[] = []
        createOrderItemRequest.forEach(orderItem => {
            if (regularizedOrderItems.some(regularizedItem => regularizedItem.productId === orderItem.productId)){
                regularizedOrderItems.find(regularizedItem => regularizedItem.productId === orderItem.productId).quantity += orderItem.quantity
            }else{
                regularizedOrderItems.push({
                    productId: orderItem.productId,
                    quantity: orderItem.quantity
                })
            }
        })
        return regularizedOrderItems;
    }

    findAll(){
        return this.db.order.findMany({
            include: {
                orderItems: true
            }
        })
    }

    async save(createOrderRequest: CreateOrderRequest){
        const orderId = await this.db.$transaction(async () => {
            // Create Order
            const order = await this.db.order.create({data: {
                userId: createOrderRequest.userId,
                status: createOrderRequest.status,
            }})

            // Regularize Order Items quantity
            const regularizedItems = this.regularizeOrderItems(createOrderRequest.orderItems)

            // Check Product Quantity Before Insert
            for (let i = 0; i < regularizedItems.length; i++){
                if (!await ProductService.isQuantityAvailable(regularizedItems[i].productId, regularizedItems[i].quantity)){
                    throw new Error('Product not available')
                }

                // Update Product Quantity
                const sql = `UPDATE Product SET quantity = quantity - ${regularizedItems[i].quantity} WHERE id = ${regularizedItems[i].productId}`
                await this.db.$queryRaw`${Prisma.raw(sql)}`
            }
            
            // Create Order Items
            regularizedItems.forEach(async orderItem => {
                await this.db.orderItem.create({data: {
                    productId: orderItem.productId,
                    orderId: order.id,
                    quantity: orderItem.quantity
                }})
            })

            return {order, orderItems: regularizedItems}
        })
        return orderId
    }

    async update(updateOrderRequest: UpdateOrderRequest){
        const order = await this.db.order.findFirst({where: { id: updateOrderRequest.orderId }})
        if (!order){
            throw new Error('Order not found')
        }

        this.db.$transaction(async () => {
            // Update Order
            await this.db.order.update({ where: { id: order.id }, data: {status: updateOrderRequest.status, userId: updateOrderRequest.userId}})

            // Regularized Items
            const regularizedItems = this.regularizeOrderItems(updateOrderRequest.orderItems);
            this.db.orderItem.deleteMany({where: {orderId: order.id}});
            
            // Create Order Items
            regularizedItems.forEach(async orderItem => {
                await this.db.orderItem.create({data: {
                    productId: orderItem.productId,
                    orderId: order.id,
                    quantity: orderItem.quantity
                }})
            })
        })

        return updateOrderRequest
    }

    delete(id: string){
        return this.db.$transaction(async () => {
            await this.db.orderItem.deleteMany({where: {orderId: Number.parseInt(id)}})
            await this.db.order.delete({where: {id: Number.parseInt(id)}})
        })
    }
}
