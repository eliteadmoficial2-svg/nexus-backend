"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ranking_service_1 = require("../ranking/ranking.service");
const economy_service_1 = require("../economy/economy.service");
let ProgressService = class ProgressService {
    prisma;
    rankingService;
    economy;
    constructor(prisma, rankingService, economy) {
        this.prisma = prisma;
        this.rankingService = rankingService;
        this.economy = economy;
    }
    async markAsCompleted(userId, habitId, score = 10) {
        const habit = await this.prisma.habit.findUnique({
            where: { id: habitId },
            include: { streak: true },
        });
        if (!habit || habit.userId !== userId) {
            throw new common_1.BadRequestException('Hábito não encontrado.');
        }
        const tokenReward = 50.0;
        await this.economy.issueReward(userId, tokenReward, 'HABIT_COMPLETED', `Recompensa por concluir hábito/meta: ${habit.title}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const progress = await this.prisma.progress.create({
            data: {
                habitId,
                completed: true,
                score,
                date: new Date(),
            },
        });
        await this.prisma.habit.update({
            where: { id: habitId },
            data: {
                completed: true,
                currentValue: habit.targetValue,
            }
        });
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
                }
                else if (lastDateClean.getTime() === today.getTime()) {
                    currentStreak = habit.streak.currentStreak;
                }
                else {
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
        }
        else {
            await this.prisma.streak.create({
                data: {
                    habitId,
                    currentStreak: 1,
                    bestStreak: 1,
                    lastCompletedDate: now,
                },
            });
        }
        await this.rankingService.updateUserScore(userId, 'HABITS', score);
        return { progress, streak: { currentStreak, bestStreak } };
    }
    async updateProgress(userId, habitId, value) {
        const habit = await this.prisma.habit.findUnique({
            where: { id: habitId },
        });
        if (!habit || habit.userId !== userId) {
            throw new common_1.BadRequestException('Hábito não encontrado.');
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
    async getHistory(userId) {
        return this.prisma.progress.findMany({
            where: {
                habit: { userId },
            },
            orderBy: { date: 'desc' },
            include: { habit: true },
        });
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ranking_service_1.RankingService,
        economy_service_1.EconomyService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map