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
exports.StoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const economy_service_1 = require("../economy/economy.service");
let StoriesService = class StoriesService {
    prisma;
    economy;
    STORY_FEE = 5.0;
    constructor(prisma, economy) {
        this.prisma = prisma;
        this.economy = economy;
    }
    async create(userId, data) {
        await this.economy.chargeProtocolFee(userId, this.STORY_FEE, 'STORY_POST', 'Taxa de publicação de Story na rede NEXUS');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        return this.prisma.story.create({
            data: {
                ...data,
                userId,
                expiresAt,
            },
        });
    }
    async findAllActive() {
        const now = new Date();
        return this.prisma.story.findMany({
            where: {
                expiresAt: {
                    gt: now,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async remove(userId, id) {
        return this.prisma.story.deleteMany({
            where: {
                id,
                userId,
            },
        });
    }
    async markAsViewed(userId, storyId) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
            select: { viewedBy: true },
        });
        if (!story)
            return null;
        let viewedBy = [];
        if (typeof story.viewedBy === 'string') {
            viewedBy = JSON.parse(story.viewedBy);
        }
        if (!viewedBy.includes(userId)) {
            viewedBy.push(userId);
            return this.prisma.story.update({
                where: { id: storyId },
                data: {
                    viewedBy: JSON.stringify(viewedBy),
                },
            });
        }
        return null;
    }
    async cleanupExpired() {
        const now = new Date();
        return this.prisma.story.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });
    }
};
exports.StoriesService = StoriesService;
exports.StoriesService = StoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        economy_service_1.EconomyService])
], StoriesService);
//# sourceMappingURL=stories.service.js.map