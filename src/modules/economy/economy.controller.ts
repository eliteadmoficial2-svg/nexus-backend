import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EconomyService } from './economy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('economy')
export class EconomyController {
    constructor(private readonly economyService: EconomyService) { }

    @Get('stats')
    async getStats() {
        return this.economyService.getGlobalStats();
    }

    @Get('price')
    async getPrice() {
        return this.economyService.getPrice();
    }

    @UseGuards(JwtAuthGuard)
    @Get('history')
    async getHistory(@Request() req: any) {
        return this.economyService.getHistory(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('buy')
    async buy(@Request() req: any, @Body() data: { amount: number }) {
        return this.economyService.buy(req.user.userId, data.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sell')
    async sell(@Request() req: any, @Body() data: { amount: number }) {
        return this.economyService.sell(req.user.userId, data.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Post('transfer')
    async transfer(@Request() req: any, @Body() data: { to: string, amount: number }) {
        return this.economyService.transfer(req.user.userId, data.to, data.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Post('withdraw-to-chain')
    async withdrawToChain(@Request() req: any, @Body() data: { amount: number, walletAddress: string }) {
        return this.economyService.withdrawToChain(req.user.userId, data.amount, data.walletAddress);
    }
}
