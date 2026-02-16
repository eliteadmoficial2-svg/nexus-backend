import { RunService } from './run.service';
export declare class RunController {
    private readonly runService;
    constructor(runService: RunService);
    startRun(req: any): Promise<{
        id: string;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        distance: number;
        avgSpeed: number | null;
        routePolyline: string | null;
        status: string;
    }>;
    addPoint(runId: string, req: any, data: {
        lat: number;
        lng: number;
    }): Promise<{
        id: string;
        runId: string;
        latitude: number;
        longitude: number;
        timestamp: Date;
    }>;
    finishRun(runId: string, data: {
        distance: number;
        avgSpeed: number;
        polyline: string;
    }): Promise<{
        id: string;
        userId: string;
        startTime: Date;
        endTime: Date | null;
        distance: number;
        avgSpeed: number | null;
        routePolyline: string | null;
        status: string;
    }>;
    getUserRuns(req: any): Promise<({
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
    getRunDetails(id: string): Promise<({
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
