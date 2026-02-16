import { PrismaService } from '../../prisma/prisma.service';
import { EconomyService } from '../economy/economy.service';
export declare class StoriesService {
    private prisma;
    private economy;
    private readonly STORY_FEE;
    constructor(prisma: PrismaService, economy: EconomyService);
    create(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
        style: import(".prisma/client").Prisma.JsonValue | null;
        filter: string | null;
        duration: number;
        createdAt: Date;
        expiresAt: Date;
        viewedBy: import(".prisma/client").Prisma.JsonValue | null;
    }>;
    findAllActive(): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        userId: string;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
        style: import(".prisma/client").Prisma.JsonValue | null;
        filter: string | null;
        duration: number;
        createdAt: Date;
        expiresAt: Date;
        viewedBy: import(".prisma/client").Prisma.JsonValue | null;
    })[]>;
    remove(userId: string, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAsViewed(userId: string, storyId: string): Promise<{
        id: string;
        userId: string;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
        style: import(".prisma/client").Prisma.JsonValue | null;
        filter: string | null;
        duration: number;
        createdAt: Date;
        expiresAt: Date;
        viewedBy: import(".prisma/client").Prisma.JsonValue | null;
    } | null>;
    cleanupExpired(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
