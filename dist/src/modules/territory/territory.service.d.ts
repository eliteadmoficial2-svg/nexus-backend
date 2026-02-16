import { PrismaService } from '../../prisma/prisma.service';
export declare class TerritoryService {
    private prisma;
    private readonly GRID_SIZE;
    constructor(prisma: PrismaService);
    private calculateGridId;
    conquer(userId: string, lat: number, lng: number): Promise<{
        id: string;
        cityId: string | null;
        latitude: number;
        longitude: number;
        gridId: string;
        ownerUserId: string | null;
        lastConqueredAt: Date | null;
        conquestCount: number;
    }>;
    getTerritoriesInView(minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<({
        owner: {
            id: string;
            name: string;
            username: string | null;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        cityId: string | null;
        latitude: number;
        longitude: number;
        gridId: string;
        ownerUserId: string | null;
        lastConqueredAt: Date | null;
        conquestCount: number;
    })[]>;
    getUserTerritories(userId: string): Promise<{
        id: string;
        cityId: string | null;
        latitude: number;
        longitude: number;
        gridId: string;
        ownerUserId: string | null;
        lastConqueredAt: Date | null;
        conquestCount: number;
    }[]>;
    getGlobalRanking(): Promise<{
        territoryCount: number;
        name?: string | undefined;
        username?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    }[]>;
}
