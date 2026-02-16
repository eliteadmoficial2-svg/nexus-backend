import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TerritoryService {
    // Definimos o tamanho do bloco (grid) em graus decimais.
    // Aproximadamente 100m x 100m na linha do equador.
    private readonly GRID_SIZE = 0.001;

    constructor(private prisma: PrismaService) { }

    private calculateGridId(lat: number, lng: number): string {
        const latIndex = Math.floor(lat / this.GRID_SIZE);
        const lngIndex = Math.floor(lng / this.GRID_SIZE);
        return `${latIndex}:${lngIndex}`;
    }

    async conquer(userId: string, lat: number, lng: number) {
        const gridId = this.calculateGridId(lat, lng);
        const now = new Date();

        // Tenta encontrar o território existente ou cria um novo.
        const territory = await this.prisma.territory.upsert({
            where: { gridId },
            update: {
                ownerUserId: userId,
                lastConqueredAt: now,
                conquestCount: { increment: 1 },
            },
            create: {
                gridId,
                latitude: lat,
                longitude: lng,
                ownerUserId: userId,
                lastConqueredAt: now,
                conquestCount: 1,
            },
        });

        return territory;
    }

    async getTerritoriesInView(minLat: number, maxLat: number, minLng: number, maxLng: number) {
        return this.prisma.territory.findMany({
            where: {
                latitude: { gte: minLat, lte: maxLat },
                longitude: { gte: minLng, lte: maxLng },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    async getUserTerritories(userId: string) {
        return this.prisma.territory.findMany({
            where: { ownerUserId: userId },
            orderBy: { lastConqueredAt: 'desc' },
        });
    }

    async getGlobalRanking() {
        // Ranking baseado em quem domina mais territórios no momento.
        const result = await this.prisma.territory.groupBy({
            by: ['ownerUserId'],
            where: { ownerUserId: { not: null } },
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    ownerUserId: 'desc'
                }
            },
            take: 10
        });

        // Mapeia para incluir nomes dos usuários.
        const ranking = await Promise.all(result.map(async (item) => {
            const user = await this.prisma.user.findUnique({
                where: { id: item.ownerUserId! },
                select: { name: true, username: true, avatarUrl: true }
            });
            return {
                ...user,
                territoryCount: item._count._all
            };
        }));

        return ranking;
    }
}
