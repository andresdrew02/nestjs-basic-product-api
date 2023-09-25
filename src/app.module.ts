import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductController } from './controllers/product/product.controller';
import { OrderController } from './controllers/order/order.controller';
import { ProductService } from './services/product/product.service';
import { OrderService } from './services/order/order.service';

@Module({
  imports: [],
  controllers: [AppController, ProductController, OrderController],
  providers: [ProductService, OrderService],
})
export class AppModule {}
