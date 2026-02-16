import { PrismaService } from '../../prisma/prisma.service';
import { RankingService } from '../ranking/ranking.service';
import { EconomyService } from '../economy/economy.service';
export declare class ProgressService {
    private prisma;
    private rankingService;
    private economy;
    constructor(prisma: PrismaService, rankingService: RankingService, economy: EconomyService);
    markAsCompleted(userId: string, habitId: string, score?: number): Promise<{
        progress: {
            id: string;
            habitId: string;
            date: Date;
            completed: boolean;
            score: number;
        };
        streak: {
            currentStreak: number;
            bestStreak: number;
        };
    }>;
    updateProgress(userId: string, habitId: string, value: number): Promise<{
        progress: {
            id: string;
            habitId: string;
            date: Date;
            completed: boolean;
            score: number;
        };
        streak: {
            currentStreak: number;
            bestStreak: number;
        };
    } | {
        currentValue: number;
        completed: boolean;
    }>;
    getHistory(userId: string): Promise<({
        habit: {
            id: string;
            userId: string;
            title: string;
            description: string | null;
            category: string;
            frequency: string;
            targetValue: number;
            currentValue: number;
            unit: string;
            completed: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        habitId: string;
        date: Date;
        completed: boolean;
        score: number;
    })[]>;
}
