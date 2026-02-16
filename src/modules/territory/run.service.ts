import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TerritoryService } from '../territory/territory.service';

@Injectable()
export class RunService {
    constructor(
        private prisma: PrismaService,
        private territoryService: TerritoryService
    ) { }

    async startRun(userId: string) {
        // Encerra corridas ativas anteriores do mesmo usuário por segurança.
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

    async addPoint(runId: string, userId: string, lat: number, lng: number) {
        const point = await this.prisma.runPoint.create({
            data: {
                runId,
                latitude: lat,
                longitude: lng,
            },
        });

        // Ao adicionar um ponto, também processamos a conquista do território.
        await this.territoryService.conquer(userId, lat, lng);

        return point;
    }

    async finishRun(runId: string, distance: number, avgSpeed: number, polyline: string) {
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

    async getUserRuns(userId: string) {
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

    async getRunDetails(runId: string) {
        return this.prisma.run.findUnique({
            where: { id: runId },
            include: { points: { orderBy: { timestamp: 'asc' } } }
        });
    }
}
