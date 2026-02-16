import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    search(query: string, currentUserId?: string): Promise<any[]>;
    update(id: string, data: Partial<Prisma.UserUpdateInput>): Promise<User>;
    countAll(): Promise<number>;
    listAll(skip?: number, take?: number): Promise<User[]>;
    toggleBan(id: string): Promise<User>;
    follow(followerId: string, followingId: string): Promise<{
        message: string;
    }>;
    unfollow(followerId: string, followingId: string): Promise<{
        message: string;
    }>;
    getProfile(targetUserId: string, currentUserId?: string): Promise<{
        isFollowing: boolean;
        passwordHash: undefined;
        id: string;
        name: string;
        username: string | null;
        email: string;
        avatarUrl: string | null;
        role: string;
        isBanned: boolean;
        bio: string | null;
        city: string | null;
        expertise: string | null;
        title: string | null;
        badges: Prisma.JsonValue | null;
        xp: number;
        level: number;
        streakDays: number;
        totalMinutes: number;
        totalWorkouts: number;
        totalProjects: number;
        followersCount: number;
        followingCount: number;
        friendsCount: number;
        consistencyScore: number;
        isPublic: boolean;
        showProgress: boolean;
        showTimeline: boolean;
        balance: number;
        walletAddress: string | null;
        createdAt: Date;
    } | null>;
}
