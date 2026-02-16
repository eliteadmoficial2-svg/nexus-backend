import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    create(req: any, body: any): Promise<{
        xpEarned: number;
        tokenReward: number;
        id: string;
        userId: string;
        type: string;
        title: string;
        description: string | null;
        duration: number;
        category: string;
        focusTag: string | null;
        imageUrl: string | null;
        mediaType: string;
        views: number;
        commentsCount: number;
        shares: number;
        createdAt: Date;
    }>;
    findAll(req: any, type?: string): Promise<{
        id: string;
        userId: string;
        type: string;
        title: string;
        description: string | null;
        duration: number;
        category: string;
        focusTag: string | null;
        imageUrl: string | null;
        mediaType: string;
        views: number;
        commentsCount: number;
        shares: number;
        createdAt: Date;
    }[]>;
    remove(req: any, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    increment(id: string, stat: 'views' | 'comments' | 'shares'): Promise<{
        id: string;
        userId: string;
        type: string;
        title: string;
        description: string | null;
        duration: number;
        category: string;
        focusTag: string | null;
        imageUrl: string | null;
        mediaType: string;
        views: number;
        commentsCount: number;
        shares: number;
        createdAt: Date;
    }>;
}
