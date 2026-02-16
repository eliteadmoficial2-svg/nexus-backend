import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
    constructor(private readonly storiesService: StoriesService) { }

    @Post()
    async create(@Req() req: any, @Body() data: any) {
        return this.storiesService.create(req.user.id, data);
    }

    @Get()
    async findAll() {
        return this.storiesService.findAllActive();
    }

    @Delete(':id')
    async remove(@Req() req: any, @Param('id') id: string) {
        return this.storiesService.remove(req.user.id, id);
    }

    @Post(':id/view')
    async markAsViewed(@Req() req: any, @Param('id') id: string) {
        return this.storiesService.markAsViewed(req.user.id, id);
    }
}
