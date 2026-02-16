import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictException('Usuário com este e-mail já existe.');
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

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async search(query: string, currentUserId?: string): Promise<any[]> {
        if (!query || query.trim().length === 0) {
            return [];
        }

        // SQLite does not support mode: 'insensitive' directly.
        // For production with Postgres, you can uncomment mode: 'insensitive'
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
                avatarUrl: true, // Ensuring avatar is returned
            },
            take: 20, // Limit results
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

    async update(id: string, data: Partial<Prisma.UserUpdateInput>): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async countAll(): Promise<number> {
        return this.prisma.user.count();
    }

    async listAll(skip = 0, take = 20): Promise<User[]> {
        return this.prisma.user.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }

    async toggleBan(id: string): Promise<User> {
        const user = await this.findById(id);
        if (!user) throw new Error('User not found');

        return this.prisma.user.update({
            where: { id },
            data: { isBanned: !user.isBanned },
        });
    }

    async follow(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new ConflictException('Não pode seguir a si mesmo.');
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

        // Transaction to update connection and counts
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

    async unfollow(followerId: string, followingId: string) {
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

        // Transaction to remove connection and update counts
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

    async getProfile(targetUserId: string, currentUserId?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!user) return null;

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
            passwordHash: undefined, // Ensure security
        };
    }
}
