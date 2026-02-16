import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ranking')
@UseGuards(JwtAuthGuard)
export class RankingController {
    constructor(private readonly rankingService: RankingService) { }

    @Get()
    async getGlobal(@Query('category') category?: string, @Query('month') month?: string, @Query('year') year?: string) {
        const now = new Date();
        const m = month ? parseInt(month) : now.getMonth() + 1;
        const y = year ? parseInt(year) : now.getFullYear();
        const cat = category || 'GLOBAL';
        return this.rankingService.getRanking(cat, m, y);
    }
}
