import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EconomyService } from '../economy/economy.service';

@Injectable()
export class SocialService {
    private readonly COMMENT_FEE = 1.0;
    private readonly REACTION_FEE = 0.5;

    constructor(
        private prisma: PrismaService,
        private economy: EconomyService
    ) { }

    async addComment(userId: string, activityId: string, content: string) {
        // 1. Charge fee
        await this.economy.chargeProtocolFee(
            userId,
            this.COMMENT_FEE,
            'COMMENT_POST',
            'Taxa de comentário em atividade'
        );

        return (this.prisma as any).comment.create({
            data: {
                content,
                userId,
                activityId,
            }
        });
    }

    async addReaction(userId: string, activityId: string, type: string) {
        // 1. Charge fee
        await this.economy.chargeProtocolFee(
            userId,
            this.REACTION_FEE,
            'REACTION_POST',
            `Taxa de reação (${type}) em atividade`
        );

        return (this.prisma as any).reaction.upsert({
            where: {
                userId_activityId_type: {
                    userId,
                    activityId,
                    type,
                }
            },
            create: {
                userId,
                activityId,
                type,
            },
            update: {
                type,
            }
        });
    }

    async getComments(activityId: string) {
        return (this.prisma as any).comment.findMany({
            where: { activityId },
            include: { user: { select: { name: true, avatarUrl: true, title: true } } },
            orderBy: { createdAt: 'asc' }
        });
    }
}
