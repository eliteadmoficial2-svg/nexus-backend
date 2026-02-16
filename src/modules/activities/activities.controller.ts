import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @Post()
    async create(@Request() req: any, @Body() body: any) {
        return this.activitiesService.create(req.user.id, body);
    }

    @Get()
    async findAll(@Request() req: any, @Query('type') type?: string) {
        if (type && type !== 'all') {
            return this.activitiesService.findByType(req.user.id, type);
        }
        return this.activitiesService.findAll(req.user.id);
    }

    @Delete(':id')
    async remove(@Request() req: any, @Param('id') id: string) {
        return this.activitiesService.remove(req.user.id, id);
    }

    @Post(':id/increment/:stat')
    async increment(@Param('id') id: string, @Param('stat') stat: 'views' | 'comments' | 'shares') {
        return this.activitiesService.incrementStat(id, stat);
    }
}
