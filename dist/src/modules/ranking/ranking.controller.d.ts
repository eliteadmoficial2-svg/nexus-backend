import { RankingService } from './ranking.service';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getGlobal(category?: string, month?: string, year?: string): Promise<({
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
}
