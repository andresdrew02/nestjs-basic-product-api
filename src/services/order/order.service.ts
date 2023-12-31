import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from 'src/db/PrismaService';
import { CreateOrderItemRequest } from 'src/dto/order/CreateOrderItemRequest';
import { CreateOrderRequest } from 'src/dto/order/CreateOrderRequest';
import { UpdateOrderRequest } from 'src/dto/order/UpdateOrderRequest';
import { ProductService } from '../product/product.service';
import { Prisma } from '@prisma/client';

export type RegularizedOrderItems = {
    productId: number
    quantity: number
}

export interface RegularizedOrderItemsWithPrice extends RegularizedOrderItems {
    linePrice: number
}

type OrderWithPrice = {
    id: number
    userId: string
    orderDate: Date
    status: string
    totalPrice: number
}

@Injectable()
export class OrderService {
    private db = PrismaService.getInstance().getClient();
    
    private regularizeOrderItems(createOrderItemRequest: CreateOrderItemRequest[]): RegularizedOrderItems[] {
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

    private async calculateOrderItemsWithPrice(regularizedOrderItems: RegularizedOrderItems[]){
        const regularizedItemsWithPrice: RegularizedOrderItemsWithPrice[] = []
        regularizedOrderItems.forEach(async orderItem => {
            regularizedItemsWithPrice.push({
                productId: orderItem.productId,
                quantity: orderItem.quantity,
                linePrice: orderItem.quantity * (await ProductService.getProductById(orderItem.productId)).price
            })
        })
        return regularizedItemsWithPrice
    }

    private calculateTotal(regularizedItemsWithPrice: RegularizedOrderItemsWithPrice[]){
        return regularizedItemsWithPrice.reduce((total, item) => total + item.linePrice, 0)
    }

    findAll(){
        return this.db.order.findMany({
            include: {
                orderItems: true
            }
        })
    }

    findOne(id: string){
        return this.db.order.findFirst({ where: { id: Number.parseInt(id) }, include: { orderItems: true}})
    }

    async save(createOrderRequest: CreateOrderRequest, req: any){
        const order = await this.db.$transaction(async (tx) => {
            // Regularize Order Items quantity
            const regularizedItems = this.regularizeOrderItems(createOrderRequest.orderItems)

            // Calculate Line Price
            const regularizedItemsWithPrice: RegularizedOrderItemsWithPrice[] = await this.calculateOrderItemsWithPrice(regularizedItems)

            // Create Order
            const order = await tx.order.create({data: {
                userId: req.user.id,
                status: "pending"
            }})


            // Check Product Quantity Before Insert
            for (const orderItem of regularizedItems){
                if (!await ProductService.isQuantityAvailable(orderItem.productId, orderItem.quantity)){
                    throw new Error('Product not available')
                }

                // Update Product Quantity
                const sql = `UPDATE Product SET quantity = quantity - ${orderItem.quantity} WHERE id = ${orderItem.productId}`
                await tx.$queryRaw`${Prisma.raw(sql)}`
            }
            
            // Create Order Items
            for (const orderItem of regularizedItemsWithPrice){
                await tx.orderItem.create({data: {
                    productId: orderItem.productId,
                    orderId: order.id,
                    quantity: orderItem.quantity,
                    totalLine: orderItem.linePrice
                }})
            }

            return {order, orderItems: regularizedItemsWithPrice}
        })
        return order
    }

    async update(updateOrderRequest: UpdateOrderRequest){
        const order = await this.db.order.findFirst({where: { id: updateOrderRequest.orderId }})
        if (!order){
            throw new Error('Order not found')
        }

        this.db.$transaction(async (tx) => {
            // Update Order
            await tx.order.update({ where: { id: order.id }, data: {status: updateOrderRequest.status, userId: updateOrderRequest.userId}})

            // Regularized Items
            const regularizedItems = this.regularizeOrderItems(updateOrderRequest.orderItems);
            tx.orderItem.deleteMany({where: {orderId: order.id}});
            
            // Create Order Items
            for (const orderItem of regularizedItems){
                await tx.orderItem.create({data: {
                    productId: orderItem.productId,
                    orderId: order.id,
                    quantity: orderItem.quantity
                }})
            }
        })

        return updateOrderRequest
    }

    delete(id: string){
        return this.db.$transaction(async (tx) => {
            await tx.orderItem.deleteMany({where: {orderId: Number.parseInt(id)}})
            await tx.order.delete({where: {id: Number.parseInt(id)}})
        })
    }

    async getUsersOrders(req:any){
        return this.db.order.findMany({ where: { user: { userId: req.user.id }}, include: { orderItems: { include: { product: true}}}})
    }
}
