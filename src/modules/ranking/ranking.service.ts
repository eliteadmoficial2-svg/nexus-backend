import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RankingService {
    constructor(private prisma: PrismaService) { }

    async getRanking(category: string = 'GLOBAL', month: number, year: number) {
        return this.prisma.ranking.findMany({
            where: { category, month, year },
            orderBy: { weeklyScore: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true, title: true, avatarUrl: true },
                },
            },
            take: 20,
        });
    }

    async updateUserScore(userId: string, category: string, additionalScore: number) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const categoriesToUpdate = ['GLOBAL', category.toUpperCase()];

        for (const cat of categoriesToUpdate) {
            const ranking = await this.prisma.ranking.findFirst({
                where: { userId, category: cat, month, year },
            });

            if (ranking) {
                await this.prisma.ranking.update({
                    where: { id: ranking.id },
                    data: {
                        weeklyScore: ranking.weeklyScore + Math.round(additionalScore),
                    },
                });
            } else {
                await this.prisma.ranking.create({
                    data: {
                        userId,
                        category: cat,
                        weeklyScore: Math.round(additionalScore),
                        month,
                        year,
                    },
                });
            }
        }
    }
}
