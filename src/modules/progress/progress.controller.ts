import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    @Post(':habitId/complete')
    async complete(@Request() req: any, @Param('habitId') habitId: string, @Body('score') score?: number) {
        return this.progressService.markAsCompleted(req.user.id, habitId, score);
    }

    @Post(':habitId/progress')
    async updateProgress(@Request() req: any, @Param('habitId') habitId: string, @Body('value') value: number) {
        return this.progressService.updateProgress(req.user.id, habitId, value);
    }

    @Get('history')
    async getHistory(@Request() req: any) {
        return this.progressService.getHistory(req.user.id);
    }
}
