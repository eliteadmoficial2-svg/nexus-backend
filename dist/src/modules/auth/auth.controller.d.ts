import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            xp: any;
            level: any;
            bio: any;
            followersCount: any;
            followingCount: any;
            friendsCount: any;
            createdAt: any;
        };
    }>;
    register(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            xp: any;
            level: any;
            bio: any;
            followersCount: any;
            followingCount: any;
            friendsCount: any;
            createdAt: any;
        };
    }>;
}
