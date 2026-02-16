"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Usuário com este e-mail já existe.');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.passwordHash, salt);
        return this.prisma.user.create({
            data: {
                ...data,
                passwordHash: hashedPassword,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    async search(query, currentUserId) {
        if (!query || query.trim().length === 0) {
            return [];
        }
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } },
                    { username: { contains: query } },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                bio: true,
                xp: true,
                level: true,
                followersCount: true,
                followingCount: true,
                avatarUrl: true,
            },
            take: 20,
        });
        if (currentUserId && users.length > 0) {
            const userIds = users.map(u => u.id);
            const follows = await this.prisma.follows.findMany({
                where: {
                    followerId: currentUserId,
                    followingId: { in: userIds },
                },
                select: { followingId: true },
            });
            const followingSet = new Set(follows.map(f => f.followingId));
            return users.map(user => ({
                ...user,
                isFollowing: followingSet.has(user.id),
            }));
        }
        return users.map(user => ({
            ...user,
            isFollowing: false,
        }));
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async countAll() {
        return this.prisma.user.count();
    }
    async listAll(skip = 0, take = 20) {
        return this.prisma.user.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }
    async toggleBan(id) {
        const user = await this.findById(id);
        if (!user)
            throw new Error('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { isBanned: !user.isBanned },
        });
    }
    async follow(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.ConflictException('Não pode seguir a si mesmo.');
        }
        const existingFollow = await this.prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
        if (existingFollow) {
            return { message: 'Já está seguindo este usuário.' };
        }
        await this.prisma.$transaction([
            this.prisma.follows.create({
                data: {
                    followerId,
                    followingId,
                },
            }),
            this.prisma.user.update({
                where: { id: followerId },
                data: { followingCount: { increment: 1 } },
            }),
            this.prisma.user.update({
                where: { id: followingId },
                data: { followersCount: { increment: 1 } },
            }),
        ]);
        return { message: 'Seguindo com sucesso.' };
    }
    async unfollow(followerId, followingId) {
        const existingFollow = await this.prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
        if (!existingFollow) {
            return { message: 'Não estava seguindo este usuário.' };
        }
        await this.prisma.$transaction([
            this.prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId,
                    },
                },
            }),
            this.prisma.user.update({
                where: { id: followerId },
                data: { followingCount: { decrement: 1 } },
            }),
            this.prisma.user.update({
                where: { id: followingId },
                data: { followersCount: { decrement: 1 } },
            }),
        ]);
        return { message: 'Deixou de seguir com sucesso.' };
    }
    async getProfile(targetUserId, currentUserId) {
        const user = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });
        if (!user)
            return null;
        let isFollowing = false;
        if (currentUserId) {
            const follow = await this.prisma.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: targetUserId,
                    },
                },
            });
            isFollowing = !!follow;
        }
        return {
            ...user,
            isFollowing,
            passwordHash: undefined,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map