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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RankingService = class RankingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRanking(category = 'GLOBAL', month, year) {
        return this.prisma.ranking.findMany({
            where: { category, month, year },
            orderBy: { weeklyScore: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true, title: true, avatarUrl: true },
                },
            },
            take: 20,
        });
    }
    async updateUserScore(userId, category, additionalScore) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const categoriesToUpdate = ['GLOBAL', category.toUpperCase()];
        for (const cat of categoriesToUpdate) {
            const ranking = await this.prisma.ranking.findFirst({
                where: { userId, category: cat, month, year },
            });
            if (ranking) {
                await this.prisma.ranking.update({
                    where: { id: ranking.id },
                    data: {
                        weeklyScore: ranking.weeklyScore + Math.round(additionalScore),
                    },
                });
            }
            else {
                await this.prisma.ranking.create({
                    data: {
                        userId,
                        category: cat,
                        weeklyScore: Math.round(additionalScore),
                        month,
                        year,
                    },
                });
            }
        }
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map