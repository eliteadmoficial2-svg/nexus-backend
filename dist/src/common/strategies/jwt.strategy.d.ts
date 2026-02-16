import { Strategy } from 'passport-jwt';
import { UsersService } from '../../modules/users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: any): Promise<{
        id: string;
        name: string;
        username: string | null;
        email: string;
        passwordHash: string;
        avatarUrl: string | null;
        role: string;
        isBanned: boolean;
        bio: string | null;
        city: string | null;
        expertise: string | null;
        title: string | null;
        badges: import(".prisma/client").Prisma.JsonValue | null;
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
    }>;
}
export {};
