import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async generateHabitReport(userId: string) {
        const habits = await this.prisma.habit.findMany({
            where: { userId },
            include: {
                streak: true,
                _count: {
                    select: { progress: true },
                },
            },
        });

        const reportData = habits.map(h => ({
            title: h.title,
            currentStreak: h.streak?.currentStreak || 0,
            bestStreak: h.streak?.bestStreak || 0,
            totalCompletions: h._count.progress,
        }));

        return this.prisma.report.create({
            data: {
                userId,
                type: 'HABIT_SUMMARY',
                jsonData: reportData as any,
            },
        });
    }

    async getUserReports(userId: string) {
        return this.prisma.report.findMany({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
        });
    }
}
