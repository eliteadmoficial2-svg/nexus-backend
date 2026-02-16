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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const ranking_service_1 = require("../ranking/ranking.service");
const titles_service_1 = require("../users/titles.service");
const economy_service_1 = require("../economy/economy.service");
let ActivitiesService = class ActivitiesService {
    prisma;
    usersService;
    rankingService;
    titlesService;
    economy;
    ACTIVITY_FEE = 2.0;
    constructor(prisma, usersService, rankingService, titlesService, economy) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.rankingService = rankingService;
        this.titlesService = titlesService;
        this.economy = economy;
    }
    async create(userId, data) {
        await this.economy.chargeProtocolFee(userId, this.ACTIVITY_FEE, 'ACTIVITY_POST', `Taxa de registro de atividade: ${data.title}`);
        const activity = await this.prisma.activity.create({
            data: {
                ...data,
                user: { connect: { id: userId } },
            },
        });
        let xpReward = 0;
        let tokenReward = 0;
        const duration = Number(data.duration) || 0;
        const type = data.type.toUpperCase();
        switch (type) {
            case 'STUDY':
                xpReward = duration * 2;
                tokenReward = duration * 0.10;
                break;
            case 'WORKOUT':
                xpReward = duration * 3;
                tokenReward = duration * 0.15;
                break;
            case 'WORK':
                xpReward = duration * 1.5;
                tokenReward = duration * 0.05;
                break;
            case 'PROJECT':
                xpReward = duration * 5;
                tokenReward = duration * 0.25;
                break;
            case 'READING':
                xpReward = duration * 2;
                tokenReward = duration * 0.10;
                break;
            case 'GOAL':
                xpReward = 500;
                tokenReward = 50.0;
                break;
            default:
                xpReward = duration;
                tokenReward = duration * 0.01;
        }
        if (tokenReward > 0) {
            await this.economy.issueReward(userId, tokenReward, 'ACTIVITY_REWARD', `Recompensa por atividade concluída: ${data.title}`);
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            const newXP = (user.xp || 0) + Math.round(xpReward);
            const newLevel = Math.floor(newXP / 1000) + 1;
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    xp: newXP,
                    level: newLevel,
                    totalMinutes: { increment: duration },
                    totalWorkouts: type === 'WORKOUT' ? { increment: 1 } : undefined,
                    totalProjects: type === 'PROJECT' ? { increment: 1 } : undefined,
                }
            });
            await this.rankingService.updateUserScore(userId, type, xpReward);
            await this.titlesService.updateTitles(userId);
        }
        return {
            ...activity,
            xpEarned: Math.round(xpReward),
            tokenReward: Number(tokenReward.toFixed(2))
        };
    }
    async findAll(userId) {
        return this.prisma.activity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByType(userId, type) {
        return this.prisma.activity.findMany({
            where: { userId, type: type.toLowerCase() },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(userId, id) {
        return this.prisma.activity.deleteMany({
            where: { id, userId },
        });
    }
    async incrementStat(id, stat) {
        const field = stat === 'comments' ? 'commentsCount' : stat;
        return this.prisma.activity.update({
            where: { id },
            data: { [field]: { increment: 1 } },
        });
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        ranking_service_1.RankingService,
        titles_service_1.TitlesService,
        economy_service_1.EconomyService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map