import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EconomyService } from '../economy/economy.service';
export declare class HabitsService {
    private prisma;
    private economy;
    private readonly HABIT_FEE;
    constructor(prisma: PrismaService, economy: EconomyService);
    create(userId: string, data: Omit<Prisma.HabitCreateInput, 'user'>): Promise<{
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
    }>;
    findAll(userId: string): Promise<({
        streak: {
            id: string;
            habitId: string;
            currentStreak: number;
            bestStreak: number;
            lastCompletedDate: Date | null;
        } | null;
    } & {
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
    })[]>;
    findOne(id: string): Promise<({
        progress: {
            id: string;
            habitId: string;
            date: Date;
            completed: boolean;
            score: number;
        }[];
        streak: {
            id: string;
            habitId: string;
            currentStreak: number;
            bestStreak: number;
            lastCompletedDate: Date | null;
        } | null;
    } & {
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
    }) | null>;
    remove(id: string): Promise<{
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
    }>;
}
