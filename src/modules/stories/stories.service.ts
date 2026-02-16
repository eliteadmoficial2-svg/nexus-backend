import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EconomyService } from '../economy/economy.service';

@Injectable()
export class StoriesService {
    private readonly STORY_FEE = 5.0; // Fixed fee for stories

    constructor(
        private prisma: PrismaService,
        private economy: EconomyService
    ) { }

    async create(userId: string, data: any) {
        // 1. Charge the protocol fee first
        await this.economy.chargeProtocolFee(
            userId,
            this.STORY_FEE,
            'STORY_POST',
            'Taxa de publicação de Story na rede NEXUS'
        );

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1); // 24 hours from now

        return this.prisma.story.create({
            data: {
                ...data,
                userId,
                expiresAt,
            },
        });
    }

    async findAllActive() {
        const now = new Date();
        // Return all stories that haven't expired, grouped by user in the frontend/service layer
        // In a high-traffic app, we'd filter by followed users, but for "Elite", it's communal/friends.
        return this.prisma.story.findMany({
            where: {
                expiresAt: {
                    gt: now,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async remove(userId: string, id: string) {
        return this.prisma.story.deleteMany({
            where: {
                id,
                userId,
            },
        });
    }

    async markAsViewed(userId: string, storyId: string) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
            select: { viewedBy: true },
        });

        if (!story) return null;

        let viewedBy = JSON.parse(story.viewedBy || '[]');
        if (!viewedBy.includes(userId)) {
            viewedBy.push(userId);
            return this.prisma.story.update({
                where: { id: storyId },
                data: {
                    viewedBy: JSON.stringify(viewedBy),
                },
            });
        }
        return null;
    }

    // Cron job or cleanup method to be called periodically
    async cleanupExpired() {
        const now = new Date();
        return this.prisma.story.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });
    }
}
