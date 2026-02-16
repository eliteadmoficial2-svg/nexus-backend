import { PrismaService } from '../../prisma/prisma.service';
export declare class RankingService {
    private prisma;
    constructor(prisma: PrismaService);
    getRanking(category: string | undefined, month: number, year: number): Promise<({
        user: {
            name: string;
            email: string;
            avatarUrl: string | null;
            title: string | null;
        };
    } & {
        id: string;
        userId: string;
        category: string;
        weeklyScore: number;
        month: number;
        year: number;
    })[]>;
    updateUserScore(userId: string, category: string, additionalScore: number): Promise<void>;
}
