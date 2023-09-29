import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from 'src/dto/auth/registerRequest';
import { LoginRequest } from 'src/dto/auth/loginRequest';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/decorators/custom';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Public()
    @Post("/register")
    @HttpCode(HttpStatus.CREATED)
    register(@Body() registerRequest: RegisterRequest){
        return this.authService.create(registerRequest);
    }

    @Public()
    @Post("/login")
    @HttpCode(HttpStatus.OK)
    login(@Body() loginRequest: LoginRequest){
        return this.authService.login(loginRequest)
    }

    @Get('/profile')
    getProfile(@Request() req){
        return req.user
    }
}
