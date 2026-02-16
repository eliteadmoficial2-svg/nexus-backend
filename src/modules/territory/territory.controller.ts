import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TerritoryService } from './territory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('territory')
@UseGuards(JwtAuthGuard)
export class TerritoryController {
    constructor(private readonly territoryService: TerritoryService) { }

    @Get('map')
    async getMap(
        @Query('minLat') minLat: string,
        @Query('maxLat') maxLat: string,
        @Query('minLng') minLng: string,
        @Query('maxLng') maxLng: string,
    ) {
        return this.territoryService.getTerritoriesInView(
            parseFloat(minLat),
            parseFloat(maxLat),
            parseFloat(minLng),
            parseFloat(maxLng),
        );
    }

    @Get('user')
    async getUserTerritories(@Req() req: any) {
        return this.territoryService.getUserTerritories(req.user.id);
    }

    @Get('ranking')
    async getRanking() {
        return this.territoryService.getGlobalRanking();
    }
}
