import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RankingService } from '../ranking/ranking.service';
import { TitlesService } from '../users/titles.service';
import { EconomyService } from '../economy/economy.service';

@Injectable()
export class ActivitiesService {
    private readonly ACTIVITY_FEE = 2.0;

    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private rankingService: RankingService,
        private titlesService: TitlesService,
        private economy: EconomyService
    ) { }

    async create(userId: string, data: any) {
        // 1. Charge the protocol fee
        await this.economy.chargeProtocolFee(
            userId,
            this.ACTIVITY_FEE,
            'ACTIVITY_POST',
            `Taxa de registro de atividade: ${data.title}`
        );

        const activity = await this.prisma.activity.create({
            data: {
                ...data,
                user: { connect: { id: userId } },
            },
        });

        // XP and Token Reward Calculation Logic
        let xpReward = 0;
        let tokenReward = 0;
        const duration = Number(data.duration) || 0;
        const type = data.type.toUpperCase();

        switch (type) {
            case 'STUDY':
                xpReward = duration * 2;
                tokenReward = duration * 0.10;
                break;
            case 'WORKOUT':
                xpReward = duration * 3;
                tokenReward = duration * 0.15;
                break;
            case 'WORK':
                xpReward = duration * 1.5;
                tokenReward = duration * 0.05;
                break;
            case 'PROJECT':
                xpReward = duration * 5;
                tokenReward = duration * 0.25;
                break;
            case 'READING':
                xpReward = duration * 2;
                tokenReward = duration * 0.10;
                break;
            case 'GOAL':
                xpReward = 500;
                tokenReward = 50.0;
                break;
            default:
                xpReward = duration;
                tokenReward = duration * 0.01;
        }

        // 2. Issue the Token Reward
        if (tokenReward > 0) {
            await this.economy.issueReward(
                userId,
                tokenReward,
                'ACTIVITY_REWARD',
                `Recompensa por atividade concluída: ${data.title}`
            );
        }

        // Update User Stats
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            const newXP = (user.xp || 0) + Math.round(xpReward);
            const newLevel = Math.floor(newXP / 1000) + 1;

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    xp: newXP,
                    level: newLevel,
                    totalMinutes: { increment: duration },
                    totalWorkouts: type === 'WORKOUT' ? { increment: 1 } : undefined,
                    totalProjects: type === 'PROJECT' ? { increment: 1 } : undefined,
                }
            });

            // Update Ranking (Global + Category)
            await this.rankingService.updateUserScore(userId, type, xpReward);

            // Update Titles
            await this.titlesService.updateTitles(userId);
        }

        return {
            ...activity,
            xpEarned: Math.round(xpReward),
            tokenReward: Number(tokenReward.toFixed(2))
        };
    }

    async findAll(userId: string) {
        return this.prisma.activity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByType(userId: string, type: string) {
        return this.prisma.activity.findMany({
            where: { userId, type: type.toLowerCase() },
            orderBy: { createdAt: 'desc' },
        });
    }

    async remove(userId: string, id: string) {
        return this.prisma.activity.deleteMany({
            where: { id, userId },
        });
    }

    async incrementStat(id: string, stat: 'views' | 'comments' | 'shares') {
        const field = stat === 'comments' ? 'commentsCount' : stat;
        return this.prisma.activity.update({
            where: { id },
            data: { [field]: { increment: 1 } },
        });
    }
}
