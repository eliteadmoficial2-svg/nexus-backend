import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('E-mail ou senha inválidos.');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: any) {
        console.log('Register request received:', body);
        if (!body.email || !body.password || !body.name) {
            throw new BadRequestException('Dados incompletos para registro.');
        }

        const user = await this.usersService.create({
            email: body.email,
            passwordHash: body.password,
            name: body.name,
            role: body.role || 'USER',
        });

        return this.authService.login(user);
    }
}
