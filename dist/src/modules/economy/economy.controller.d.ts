import { EconomyService } from './economy.service';
export declare class EconomyController {
    private readonly economyService;
    constructor(economyService: EconomyService);
    getStats(): Promise<{
        id: string;
        totalBurned: number;
        treasuryBalance: number;
        operationalRevenue: number;
        circulatingSupply: number;
        updatedAt: Date;
    }>;
    getPrice(): Promise<{
        price: number;
    }>;
    getHistory(req: any): Promise<({
        receiver: {
            name: string;
            avatarUrl: string | null;
        };
        sender: {
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        senderId: string | null;
        receiverId: string;
        amount: number;
        netAmount: number;
        taxAmount: number;
        type: string;
        description: string | null;
        createdAt: Date;
    })[]>;
    buy(req: any, data: {
        amount: number;
    }): Promise<{
        id: string;
        senderId: string | null;
        receiverId: string;
        amount: number;
        netAmount: number;
        taxAmount: number;
        type: string;
        description: string | null;
        createdAt: Date;
    }>;
    sell(req: any, data: {
        amount: number;
    }): Promise<{
        id: string;
        senderId: string | null;
        receiverId: string;
        amount: number;
        netAmount: number;
        taxAmount: number;
        type: string;
        description: string | null;
        createdAt: Date;
    }>;
    transfer(req: any, data: {
        to: string;
        amount: number;
    }): Promise<{
        id: string;
        senderId: string | null;
        receiverId: string;
        amount: number;
        netAmount: number;
        taxAmount: number;
        type: string;
        description: string | null;
        createdAt: Date;
    }>;
    withdrawToChain(req: any, data: {
        amount: number;
        walletAddress: string;
    }): Promise<{
        message: string;
        txHash: string;
        transactionId: string;
    }>;
}
