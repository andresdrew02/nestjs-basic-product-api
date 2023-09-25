import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/PrismaService';

@Injectable()
export class OrderService {
    private db = PrismaService.getInstance().getClient();
    findAll(){
        return this.db.order.findMany()
    }
}
