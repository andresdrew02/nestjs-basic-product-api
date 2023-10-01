import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/db/PrismaService';
import { RegisterRequest } from 'src/dto/auth/registerRequest';
import * as bcrypt from 'bcrypt'
import { LoginRequest } from 'src/dto/auth/loginRequest';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService){}

    private db = PrismaService.getInstance().getClient();

    private async checkIfUserExists(email: string, username: string){
        const user = await this.db.user.findFirst({ where: {email, OR: [{username}]} });
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

        if (await this.checkIfUserExists(email, username)){
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
            const payload = { id: user.userId, username: user.username, email: user.email };
            return {
                access_token: await this.jwtService.signAsync(payload, { secret: jwtConstants.secret })
            }
        }
        return new Error('User not created')
    }

    async login(loginRequest: LoginRequest){
        const { email, password } = loginRequest;
        const user = await this.db.user.findFirst({ where: {email} });
        if (!user){
            return new HttpException('Incorrect user or password', 400)
        }
        if (!await bcrypt.compare(password, user.password)){
            throw new HttpException('Incorrect user or password', 400)
        }
        const payload = { id: user.userId, username: user.username, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload, { secret: jwtConstants.secret })
        } 
    }
}
