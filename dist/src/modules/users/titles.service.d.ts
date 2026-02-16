import { PrismaService } from '../../prisma/prisma.service';
export declare class TitlesService {
    private prisma;
    constructor(prisma: PrismaService);
    updateTitles(userId: string): Promise<void>;
}
