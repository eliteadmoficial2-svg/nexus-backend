"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerritoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TerritoryService = class TerritoryService {
    prisma;
    GRID_SIZE = 0.001;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateGridId(lat, lng) {
        const latIndex = Math.floor(lat / this.GRID_SIZE);
        const lngIndex = Math.floor(lng / this.GRID_SIZE);
        return `${latIndex}:${lngIndex}`;
    }
    async conquer(userId, lat, lng) {
        const gridId = this.calculateGridId(lat, lng);
        const now = new Date();
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
    async getTerritoriesInView(minLat, maxLat, minLng, maxLng) {
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
    async getUserTerritories(userId) {
        return this.prisma.territory.findMany({
            where: { ownerUserId: userId },
            orderBy: { lastConqueredAt: 'desc' },
        });
    }
    async getGlobalRanking() {
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
        const ranking = await Promise.all(result.map(async (item) => {
            const user = await this.prisma.user.findUnique({
                where: { id: item.ownerUserId },
                select: { name: true, username: true, avatarUrl: true }
            });
            return {
                ...user,
                territoryCount: item._count._all
            };
        }));
        return ranking;
    }
};
exports.TerritoryService = TerritoryService;
exports.TerritoryService = TerritoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TerritoryService);
//# sourceMappingURL=territory.service.js.map