import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
    constructor(private readonly socialService: SocialService) { }

    @Post('comment/:activityId')
    async comment(@Req() req: any, @Param('activityId') activityId: string, @Body('content') content: string) {
        return this.socialService.addComment(req.user.id, activityId, content);
    }

    @Post('react/:activityId')
    async react(@Req() req: any, @Param('activityId') activityId: string, @Body('type') type: string) {
        return this.socialService.addReaction(req.user.id, activityId, type);
    }

    @Get('comments/:activityId')
    async getComments(@Param('activityId') activityId: string) {
        return this.socialService.getComments(activityId);
    }
}
