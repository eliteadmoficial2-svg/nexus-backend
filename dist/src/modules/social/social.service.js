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
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const economy_service_1 = require("../economy/economy.service");
let SocialService = class SocialService {
    prisma;
    economy;
    COMMENT_FEE = 1.0;
    REACTION_FEE = 0.5;
    constructor(prisma, economy) {
        this.prisma = prisma;
        this.economy = economy;
    }
    async addComment(userId, activityId, content) {
        await this.economy.chargeProtocolFee(userId, this.COMMENT_FEE, 'COMMENT_POST', 'Taxa de comentário em atividade');
        return this.prisma.comment.create({
            data: {
                content,
                userId,
                activityId,
            }
        });
    }
    async addReaction(userId, activityId, type) {
        await this.economy.chargeProtocolFee(userId, this.REACTION_FEE, 'REACTION_POST', `Taxa de reação (${type}) em atividade`);
        return this.prisma.reaction.upsert({
            where: {
                userId_activityId_type: {
                    userId,
                    activityId,
                    type,
                }
            },
            create: {
                userId,
                activityId,
                type,
            },
            update: {
                type,
            }
        });
    }
    async getComments(activityId) {
        return this.prisma.comment.findMany({
            where: { activityId },
            include: { user: { select: { name: true, avatarUrl: true, title: true } } },
            orderBy: { createdAt: 'asc' }
        });
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        economy_service_1.EconomyService])
], SocialService);
//# sourceMappingURL=social.service.js.map