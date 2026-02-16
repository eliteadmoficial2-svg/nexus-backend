import { PrismaService } from '../../prisma/prisma.service';
import { EconomyService } from '../economy/economy.service';
export declare class SocialService {
    private prisma;
    private economy;
    private readonly COMMENT_FEE;
    private readonly REACTION_FEE;
    constructor(prisma: PrismaService, economy: EconomyService);
    addComment(userId: string, activityId: string, content: string): Promise<any>;
    addReaction(userId: string, activityId: string, type: string): Promise<any>;
    getComments(activityId: string): Promise<any>;
}
