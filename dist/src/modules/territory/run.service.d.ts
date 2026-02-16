import { PrismaService } from '../../prisma/prisma.service';
import { TerritoryService } from '../territory/territory.service';
export declare class RunService {
    private prisma;
    private territoryService;
    constructor(prisma: PrismaService, territoryService: TerritoryService);
    startRun(userId: string): Promise<{
        id: string;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        distance: number;
        avgSpeed: number | null;
        routePolyline: string | null;
        status: string;
    }>;
    addPoint(runId: string, userId: string, lat: number, lng: number): Promise<{
        id: string;
        runId: string;
        latitude: number;
        longitude: number;
        timestamp: Date;
    }>;
    finishRun(runId: string, distance: number, avgSpeed: number, polyline: string): Promise<{
        id: string;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        distance: number;
        avgSpeed: number | null;
        routePolyline: string | null;
        status: string;
    }>;
    getUserRuns(userId: string): Promise<({
        _count: {
            points: number;
        };
    } & {
        id: string;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        distance: number;
        avgSpeed: number | null;
        routePolyline: string | null;
        status: string;
    })[]>;
    getRunDetails(runId: string): Promise<({
        points: {
            id: string;
            runId: string;
            latitude: number;
            longitude: number;
            timestamp: Date;
        }[];
    } & {
        id: string;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        distance: number;
        avgSpeed: number | null;
        routePolyline: string | null;
        status: string;
    }) | null>;
}
