import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/db/PrismaService';
import { RegisterRequest } from 'src/dto/auth/registerRequest';
import * as bcrypt from 'bcrypt'
import { LoginRequest } from 'src/dto/auth/loginRequest';

@Injectable()
export class AuthService {
    private db = PrismaService.getInstance().getClient();

    private checkIfUserExists(email: string, username: string){
        const user = this.db.user.findFirst({ where: {email, OR: [{username}]} });
        return user !== null
    }

    async findOne(email: string){
        return this.db.user.findFirstOrThrow({ where: {email} });
    }
    
    async findAll(){
        return this.db.user.findMany();
    }

    async create(registerRequest: RegisterRequest){
        const { username, email, password } = registerRequest;

        if (this.checkIfUserExists(email, username)){
            throw new HttpException('User already exists', 400)
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.db.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        })
        if (user){
            return user
        }
        return new Error('User not created')
    }

    //TODO: JWT SERVICE

    async login(loginRequest: LoginRequest){
        const { email, password } = loginRequest;
        const user = await this.db.user.findFirstOrThrow({ where: {email} });
        if (await bcrypt.compare(password, user.password)){
            return user
        }
        return new HttpException('Invalid credentials', 400)
    }
}
