import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post('habit-summary')
    async generateSummary(@Request() req: any) {
        return this.reportsService.generateHabitReport(req.user.id);
    }

    @Get()
    async getMyReports(@Request() req: any) {
        return this.reportsService.getUserReports(req.user.id);
    }
}
