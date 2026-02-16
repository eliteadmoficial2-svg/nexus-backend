import { PrismaService } from '../../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateHabitReport(userId: string): Promise<{
        id: string;
        userId: string;
        type: string;
        generatedAt: Date;
        jsonData: import(".prisma/client").Prisma.JsonValue;
    }>;
    getUserReports(userId: string): Promise<{
        id: string;
        userId: string;
        type: string;
        generatedAt: Date;
        jsonData: import(".prisma/client").Prisma.JsonValue;
    }[]>;
}
