import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RankingService } from '../ranking/ranking.service';
import { EconomyService } from '../economy/economy.service';

@Injectable()
export class ProgressService {
    constructor(
        private prisma: PrismaService,
        private rankingService: RankingService,
        private economy: EconomyService,
    ) { }

    async markAsCompleted(userId: string, habitId: string, score: number = 10) {
        const habit = await this.prisma.habit.findUnique({
            where: { id: habitId },
            include: { streak: true },
        });

        if (!habit || habit.userId !== userId) {
            throw new BadRequestException('Hábito não encontrado.');
        }

        // ... (existing logic)

        // Give Token Reward
        const tokenReward = 50.0;
        await this.economy.issueReward(
            userId,
            tokenReward,
            'HABIT_COMPLETED',
            `Recompensa por concluir hábito/meta: ${habit.title}`
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Create Progress record
        const progress = await this.prisma.progress.create({
            data: {
                habitId,
                completed: true,
                score,
                date: new Date(),
            },
        });

        // Update Habit state
        await this.prisma.habit.update({
            where: { id: habitId },
            data: {
                completed: true,
                currentValue: habit.targetValue,
            }
        });

        // 2. Calculate/Update Streak
        let currentStreak = 1;
        let bestStreak = 1;
        const now = new Date();

        if (habit.streak) {
            const lastDate = habit.streak.lastCompletedDate;
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            if (lastDate) {
                const lastDateClean = new Date(lastDate);
                lastDateClean.setHours(0, 0, 0, 0);

                if (lastDateClean.getTime() === yesterday.getTime()) {
                    currentStreak = habit.streak.currentStreak + 1;
                } else if (lastDateClean.getTime() === today.getTime()) {
                    currentStreak = habit.streak.currentStreak;
                } else {
                    currentStreak = 1;
                }
            }

            bestStreak = Math.max(currentStreak, habit.streak.bestStreak);

            await this.prisma.streak.update({
                where: { habitId },
                data: {
                    currentStreak,
                    bestStreak,
                    lastCompletedDate: now,
                },
            });
        } else {
            await this.prisma.streak.create({
                data: {
                    habitId,
                    currentStreak: 1,
                    bestStreak: 1,
                    lastCompletedDate: now,
                },
            });
        }

        // 3. Update Ranking Score
        await this.rankingService.updateUserScore(userId, 'HABITS', score);

        return { progress, streak: { currentStreak, bestStreak } };
    }

    async updateProgress(userId: string, habitId: string, value: number) {
        const habit = await this.prisma.habit.findUnique({
            where: { id: habitId },
        });

        if (!habit || habit.userId !== userId) {
            throw new BadRequestException('Hábito não encontrado.');
        }

        const newValue = habit.currentValue + value;
        const isCompleted = newValue >= habit.targetValue;

        await this.prisma.habit.update({
            where: { id: habitId },
            data: {
                currentValue: newValue,
                completed: isCompleted,
            },
        });

        if (isCompleted && !habit.completed) {
            return this.markAsCompleted(userId, habitId, 50);
        }

        return { currentValue: newValue, completed: isCompleted };
    }

    async getHistory(userId: string) {
        return this.prisma.progress.findMany({
            where: {
                habit: { userId },
            },
            orderBy: { date: 'desc' },
            include: { habit: true },
        });
    }
}
