import { Controller, Get, Post, Body, Param, Put, UseGuards, Query, Patch, Req, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('search')
    async search(@Query('q') query: string, @Req() req: any) {
        // req.user might be undefined if guard is not applied to this specific route or global
        // We need to check if we have a user to pass their ID
        const currentUserId = req?.user?.id;
        return this.usersService.search(query, currentUserId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: any) {
        // Try to get current user from request if available (handling optional auth in future might be needed)
        // For now, if JwtAuthGuard is not here, req.user is undefined.
        // But we can add specific endpoints or just use the service.
        // Let's assume for this specific path we might want to know relationship status if we are logged in.
        // But since this route is public (presumably), we might not have user info.
        // We will treat it as simple get for now, or use a custom decorator/guard if needed.
        // Actually, let's keep it simple. If the frontend sends the token, we can decode it, 
        // OR we can make a new endpoint `GET /users/profile/:id` which is authenticated.

        // Use getProfile if we can get the user ID, otherwise findById
        // Since we don't have OptionalAuthGuard set up, let's just use findById for public access
        // and create a new authenticated endpoint for full profile with relationship.
        return this.usersService.findById(id);
    }

    @Get('profile/:id')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Param('id') id: string, @Req() req: any) {
        console.log(`[DEBUG] getProfile for ${id} requested by ${req.user.id}`);
        try {
            const profile = await this.usersService.getProfile(id, req.user.id);
            console.log(`[DEBUG] getProfile result:`, profile ? 'Found' : 'Null');
            if (!profile) {
                throw new NotFoundException('User not found');
            }
            return profile;
        } catch (e) {
            console.error(`[DEBUG] getProfile Error:`, e);
            throw e;
        }
    }

    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    async follow(@Param('id') id: string, @Req() req: any) {
        console.log(`[DEBUG] Follow request: ${req.user.id} -> ${id}`);
        try {
            return await this.usersService.follow(req.user.id, id);
        } catch (e) {
            console.error(`[DEBUG] Follow Error:`, e);
            throw e;
        }
    }

    @Post(':id/unfollow') // Using POST for simplicity or DELETE
    @UseGuards(JwtAuthGuard)
    async unfollow(@Param('id') id: string, @Req() req: any) {
        console.log(`[DEBUG] Unfollow request: ${req.user.id} -> ${id}`);
        try {
            return await this.usersService.unfollow(req.user.id, id);
        } catch (e) {
            console.error(`[DEBUG] Unfollow Error:`, e);
            throw e;
        }
    }

    @Get('admin/stats')
    @UseGuards(JwtAuthGuard)
    async getAdminStats() {
        const count = await this.usersService.countAll();
        return {
            users: count,
            status: 'Online',
            latency: '14ms',
            alerts: 0 // This could be tied to logs in the future
        };
    }

    @Get('admin/list')
    @UseGuards(JwtAuthGuard)
    async listUsers(@Query('limit') limit: string) {
        const take = parseInt(limit) || 50;
        return this.usersService.listAll(0, take);
    }

    @Patch('admin/:id/ban')
    @UseGuards(JwtAuthGuard)
    async toggleBan(@Param('id') id: string) {
        return this.usersService.toggleBan(id);
    }
}
