import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
    constructor(private readonly habitsService: HabitsService) { }

    @Post()
    async create(@Request() req: any, @Body() data: any) {
        return this.habitsService.create(req.user.id, data);
    }

    @Get()
    async findAll(@Request() req: any) {
        return this.habitsService.findAll(req.user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.habitsService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.habitsService.remove(id);
    }
}
