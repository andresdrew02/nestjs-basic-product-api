import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from 'src/dto/auth/registerRequest';
import { LoginRequest } from 'src/dto/auth/loginRequest';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("/register")
    register(@Body() registerRequest: RegisterRequest){
        return this.authService.create(registerRequest);
    }

    @Post("/login")
    login(@Body() loginRequest: LoginRequest){
        return this.authService.login(loginRequest)
    }
}
