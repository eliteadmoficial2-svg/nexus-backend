import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generateSummary(req: any): Promise<{
        id: string;
        userId: string;
        type: string;
        generatedAt: Date;
        jsonData: import(".prisma/client").Prisma.JsonValue;
    }>;
    getMyReports(req: any): Promise<{
        id: string;
        userId: string;
        type: string;
        generatedAt: Date;
        jsonData: import(".prisma/client").Prisma.JsonValue;
    }[]>;
}
