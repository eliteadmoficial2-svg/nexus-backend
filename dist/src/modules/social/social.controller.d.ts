import { SocialService } from './social.service';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
    comment(req: any, activityId: string, content: string): Promise<any>;
    react(req: any, activityId: string, type: string): Promise<any>;
    getComments(activityId: string): Promise<any>;
}
