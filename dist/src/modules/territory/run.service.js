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
exports.RunService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const territory_service_1 = require("../territory/territory.service");
let RunService = class RunService {
    prisma;
    territoryService;
    constructor(prisma, territoryService) {
        this.prisma = prisma;
        this.territoryService = territoryService;
    }
    async startRun(userId) {
        await this.prisma.run.updateMany({
            where: { userId, status: 'active' },
            data: { status: 'completed', endTime: new Date() }
        });
        return this.prisma.run.create({
            data: {
                userId,
                status: 'active',
            },
        });
    }
    async addPoint(runId, userId, lat, lng) {
        const point = await this.prisma.runPoint.create({
            data: {
                runId,
                latitude: lat,
                longitude: lng,
            },
        });
        await this.territoryService.conquer(userId, lat, lng);
        return point;
    }
    async finishRun(runId, distance, avgSpeed, polyline) {
        return this.prisma.run.update({
            where: { id: runId },
            data: {
                status: 'completed',
                endTime: new Date(),
                distance,
                avgSpeed,
                routePolyline: polyline,
            },
        });
    }
    async getUserRuns(userId) {
        return this.prisma.run.findMany({
            where: { userId },
            orderBy: { startTime: 'desc' },
            include: {
                _count: {
                    select: { points: true }
                }
            }
        });
    }
    async getRunDetails(runId) {
        return this.prisma.run.findUnique({
            where: { id: runId },
            include: { points: { orderBy: { timestamp: 'asc' } } }
        });
    }
};
exports.RunService = RunService;
exports.RunService = RunService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        territory_service_1.TerritoryService])
], RunService);
//# sourceMappingURL=run.service.js.map