import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class EconomyService implements OnModuleInit {
    private prisma;
    private readonly TAX_RATE;
    private readonly TREASURY_RATIO;
    private readonly BURN_RATIO;
    private readonly REVENUE_RATIO;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getGlobalStats(): Promise<{
        id: string;
        totalBurned: number;
        treasuryBalance: number;
        operationalRevenue: number;
        circulatingSupply: number;
        updatedAt: Date;
    }>;
    transfer(senderId: string, receiverIdOrEmail: string, amount: number): Promise<{
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
    buy(userId: string, amount: number): Promise<{
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
    sell(userId: string, amount: number): Promise<{
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
    chargeProtocolFee(userId: string, amount: number, actionType: string, description: string): Promise<{
        id: string;
        senderId: string | null;
        receiverId: string;
        amount: number;
        netAmount: number;
        taxAmount: number;
        type: string;
        description: string | null;
        createdAt: Date;
    } | undefined>;
    issueReward(userId: string, amount: number, actionType: string, description: string): Promise<{
        id: string;
        senderId: string | null;
        receiverId: string;
        amount: number;
        netAmount: number;
        taxAmount: number;
        type: string;
        description: string | null;
        createdAt: Date;
    } | undefined>;
    getHistory(userId: string): Promise<({
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
    getPrice(): Promise<{
        price: number;
    }>;
    withdrawToChain(userId: string, amount: number, walletAddress: string): Promise<{
        message: string;
        txHash: string;
        transactionId: string;
    }>;
}
