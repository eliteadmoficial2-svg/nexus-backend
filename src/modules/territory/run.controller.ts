import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RunService } from './run.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('runs')
@UseGuards(JwtAuthGuard)
export class RunController {
    constructor(private readonly runService: RunService) { }

    @Post('start')
    async startRun(@Req() req: any) {
        return this.runService.startRun(req.user.id);
    }

    @Post(':id/point')
    async addPoint(
        @Param('id') runId: string,
        @Req() req: any,
        @Body() data: { lat: number; lng: number }
    ) {
        return this.runService.addPoint(runId, req.user.id, data.lat, data.lng);
    }

    @Post(':id/finish')
    async finishRun(
        @Param('id') runId: string,
        @Body() data: { distance: number; avgSpeed: number; polyline: string }
    ) {
        return this.runService.finishRun(runId, data.distance, data.avgSpeed, data.polyline);
    }

    @Get('user')
    async getUserRuns(@Req() req: any) {
        return this.runService.getUserRuns(req.user.id);
    }

    @Get(':id')
    async getRunDetails(@Param('id') id: string) {
        return this.runService.getRunDetails(id);
    }
}
