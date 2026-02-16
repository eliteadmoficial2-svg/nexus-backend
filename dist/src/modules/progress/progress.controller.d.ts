import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    complete(req: any, habitId: string, score?: number): Promise<{
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
    updateProgress(req: any, habitId: string, value: number): Promise<{
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
    getHistory(req: any): Promise<({
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
