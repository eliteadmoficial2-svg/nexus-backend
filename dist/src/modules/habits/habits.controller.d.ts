import { HabitsService } from './habits.service';
export declare class HabitsController {
    private readonly habitsService;
    constructor(habitsService: HabitsService);
    create(req: any, data: any): Promise<{
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
    findAll(req: any): Promise<({
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
