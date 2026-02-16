import { StoriesService } from './stories.service';
export declare class StoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    create(req: any, data: any): Promise<{
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
    findAll(): Promise<({
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
    remove(req: any, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAsViewed(req: any, id: string): Promise<{
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
}
