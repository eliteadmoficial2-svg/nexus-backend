import { TerritoryService } from './territory.service';
export declare class TerritoryController {
    private readonly territoryService;
    constructor(territoryService: TerritoryService);
    getMap(minLat: string, maxLat: string, minLng: string, maxLng: string): Promise<({
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
    getUserTerritories(req: any): Promise<{
        id: string;
        cityId: string | null;
        latitude: number;
        longitude: number;
        gridId: string;
        ownerUserId: string | null;
        lastConqueredAt: Date | null;
        conquestCount: number;
    }[]>;
    getRanking(): Promise<{
        territoryCount: number;
        name?: string | undefined;
        username?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    }[]>;
}
