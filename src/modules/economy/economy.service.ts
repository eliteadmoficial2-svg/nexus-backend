import { Injectable, BadRequestException, ConflictException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EconomyService implements OnModuleInit {
    private readonly TAX_RATE = 0.02;
    private readonly TREASURY_RATIO = 0.4;
    private readonly BURN_RATIO = 0.3;
    private readonly REVENUE_RATIO = 0.3;

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        // Ensure Global Stats exist
        await this.prisma.globalStats.upsert({
            where: { id: 'nexus_global_stats' },
            update: {},
            create: {
                id: 'nexus_global_stats',
                circulatingSupply: 1000000,
                totalBurned: 0,
                treasuryBalance: 50000,
                operationalRevenue: 10000,
            },
        });

        // Ensure System/Protocol Users exist for transactions
        const systemIds = ['PROTOCOL_MINT', 'PROTOCOL_BURN', 'TOKEN_BRIDGE', 'SYSTEM'];
        for (const id of systemIds) {
            await this.prisma.user.upsert({
                where: { id },
                update: {},
                create: {
                    id,
                    name: 'Nexus System Account',
                    email: `system_${id.toLowerCase()}@nexus.internal`,
                    passwordHash: 'SYSTEM_ACCOUNT',
                    role: 'ADMIN',
                },
            });
        }
    }

    async getGlobalStats() {
        const stats = await this.prisma.globalStats.findUnique({
            where: { id: 'nexus_global_stats' },
        });
        if (!stats) throw new NotFoundException('Estatísticas globais não encontradas.');
        return stats;
    }

    async transfer(senderId: string, receiverIdOrEmail: string, amount: number) {
        if (amount <= 0) throw new ConflictException('O valor deve ser maior que zero.');

        // Find receiver (could be ID or Email/Username)
        const receiver = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: receiverIdOrEmail },
                    { email: receiverIdOrEmail },
                    { username: receiverIdOrEmail },
                ],
            },
        });

        if (!receiver) throw new NotFoundException('Destinatário não encontrado.');
        if (senderId === receiver.id) throw new ConflictException('Não pode transferir para si mesmo.');

        const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
        if (!sender || sender.balance < amount) {
            throw new ConflictException('Saldo insuficiente.');
        }

        const taxAmount = amount * this.TAX_RATE;
        const netAmount = amount - taxAmount;

        const treasuryPart = taxAmount * this.TREASURY_RATIO;
        const burnPart = taxAmount * this.BURN_RATIO;
        const revenuePart = taxAmount * this.REVENUE_RATIO;

        // Atomic Transaction
        return await this.prisma.$transaction(async (tx) => {
            // 1. Update Sender
            await tx.user.update({
                where: { id: senderId },
                data: { balance: { decrement: amount } },
            });

            // 2. Update Receiver
            await tx.user.update({
                where: { id: receiver.id },
                data: { balance: { increment: netAmount } },
            });

            // 3. Update Global Stats
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                    circulatingSupply: { decrement: burnPart },
                },
            });

            // 4. Record Transaction
            return await tx.transaction.create({
                data: {
                    senderId,
                    receiverId: receiver.id,
                    amount,
                    netAmount,
                    taxAmount,
                    type: 'TRANSFER',
                    description: `Transferência segura para ${receiver.name}`,
                },
            });
        });
    }

    async buy(userId: string, amount: number) {
        if (amount <= 0) throw new ConflictException('O valor deve ser maior que zero.');

        // Simple check: In a real app, this would be tied to a payment gateway.
        // For this protocol, we increase the supply and apply the tax.
        const taxAmount = amount * this.TAX_RATE;
        const netAmount = amount - taxAmount;

        const treasuryPart = taxAmount * this.TREASURY_RATIO;
        const burnPart = taxAmount * this.BURN_RATIO;
        const revenuePart = taxAmount * this.REVENUE_RATIO;

        return await this.prisma.$transaction(async (tx) => {
            // 1. Increase user balance
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: netAmount } },
            });

            // 2. Update Global Stats (Price growth also happens here due to supply change)
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    circulatingSupply: { increment: amount }, // Total minted
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                },
            });

            // 3. Record Transaction
            return await tx.transaction.create({
                data: {
                    senderId: 'PROTOCOL_MINT',
                    receiverId: userId,
                    amount,
                    netAmount,
                    taxAmount,
                    type: 'BUY',
                    description: `Aquisição de ${amount} NXC via protocolo`,
                },
            });
        });
    }

    async sell(userId: string, amount: number) {
        if (amount <= 0) throw new ConflictException('O valor deve ser maior que zero.');

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amount) {
            throw new ConflictException('Saldo insuficiente para venda.');
        }

        const taxAmount = amount * this.TAX_RATE;
        const netAmount = amount - taxAmount;

        const treasuryPart = taxAmount * this.TREASURY_RATIO;
        const burnPart = taxAmount * this.BURN_RATIO;
        const revenuePart = taxAmount * this.REVENUE_RATIO;

        return await this.prisma.$transaction(async (tx) => {
            // 1. Decrease user balance
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } },
            });

            // 2. Update Global Stats (Supply decreases on sell)
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    circulatingSupply: { decrement: amount },
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                },
            });

            // 3. Record Transaction
            return await tx.transaction.create({
                data: {
                    senderId: userId,
                    receiverId: 'PROTOCOL_BURN',
                    amount,
                    netAmount,
                    taxAmount,
                    type: 'SELL',
                    description: `Venda de ${amount} NXC para o protocolo`,
                },
            });
        });
    }

    async chargeProtocolFee(userId: string, amount: number, actionType: string, description: string) {
        if (amount <= 0) return; // No fee to charge

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amount) {
            throw new ConflictException(`Saldo insuficiente para pagar a taxa de ${actionType}.`);
        }

        const treasuryPart = amount * this.TREASURY_RATIO;
        const burnPart = amount * this.BURN_RATIO;
        const revenuePart = amount * this.REVENUE_RATIO;

        return await this.prisma.$transaction(async (tx) => {
            // 1. Deduct from user
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } },
            });

            // 2. Update Global Stats
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                    circulatingSupply: { decrement: burnPart },
                },
            });

            // 3. Record as System Transaction
            return await tx.transaction.create({
                data: {
                    senderId: userId,
                    receiverId: 'SYSTEM', // Special ID for protocol fees
                    amount,
                    netAmount: 0,
                    taxAmount: amount,
                    type: actionType,
                    description,
                },
            });
        });
    }

    async issueReward(userId: string, amount: number, actionType: string, description: string) {
        if (amount <= 0) return;

        return await this.prisma.$transaction(async (tx) => {
            // 1. Increase user balance (Reward is a protocol mint)
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } },
            });

            // 2. Update Global Stats (Increasing supply due to reward minting)
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    circulatingSupply: { increment: amount },
                },
            });

            // 3. Record Transaction
            return await tx.transaction.create({
                data: {
                    senderId: 'PROTOCOL_MINT',
                    receiverId: userId,
                    amount,
                    netAmount: amount,
                    taxAmount: 0,
                    type: actionType,
                    description,
                },
            });
        });
    }

    async getHistory(userId: string) {
        return this.prisma.transaction.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                sender: { select: { name: true, avatarUrl: true } },
                receiver: { select: { name: true, avatarUrl: true } },
            },
        });
    }

    async getPrice() {
        // Simple scarcity algorithm
        const stats = await this.getGlobalStats();
        const INITIAL_PRICE = 0.5;
        const MAX_SUPPLY = 21000000;
        const circulatingSupply = stats.circulatingSupply || 1000000; // Fallback to 1M if empty

        const scarcityFactor = circulatingSupply / MAX_SUPPLY;
        const price = INITIAL_PRICE + (scarcityFactor * 10) * Math.pow(scarcityFactor + 1, 2);

        return { price };
    }

    async withdrawToChain(userId: string, amount: number, walletAddress: string) {
        if (amount <= 0) throw new BadRequestException('Valor inválido.');

        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user || user.balance < amount) {
                throw new BadRequestException('Saldo insuficiente para o saque.');
            }

            // 1. Update user balance
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } }
            });

            // 2. Create withdrawal transaction log
            const transaction = await tx.transaction.create({
                data: {
                    senderId: userId,
                    receiverId: 'TOKEN_BRIDGE',
                    amount,
                    netAmount: amount,
                    taxAmount: 0,
                    type: 'WITHDRAW',
                    description: `Saque NXC para carteira Web3: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                },
            });

            return {
                message: 'Saque processado com sucesso. Os tokens NXC aparecerão na sua carteira em breve.',
                txHash: `0x${Math.random().toString(16).slice(2)}...nxc`,
                transactionId: transaction.id
            };
        });
    }
}
