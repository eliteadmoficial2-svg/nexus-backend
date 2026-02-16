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
exports.EconomyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let EconomyService = class EconomyService {
    prisma;
    TAX_RATE = 0.02;
    TREASURY_RATIO = 0.4;
    BURN_RATIO = 0.3;
    REVENUE_RATIO = 0.3;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
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
        if (!stats)
            throw new common_1.NotFoundException('Estatísticas globais não encontradas.');
        return stats;
    }
    async transfer(senderId, receiverIdOrEmail, amount) {
        if (amount <= 0)
            throw new common_1.ConflictException('O valor deve ser maior que zero.');
        const receiver = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: receiverIdOrEmail },
                    { email: receiverIdOrEmail },
                    { username: receiverIdOrEmail },
                ],
            },
        });
        if (!receiver)
            throw new common_1.NotFoundException('Destinatário não encontrado.');
        if (senderId === receiver.id)
            throw new common_1.ConflictException('Não pode transferir para si mesmo.');
        const sender = await this.prisma.user.findUnique({ where: { id: senderId } });
        if (!sender || sender.balance < amount) {
            throw new common_1.ConflictException('Saldo insuficiente.');
        }
        const taxAmount = amount * this.TAX_RATE;
        const netAmount = amount - taxAmount;
        const treasuryPart = taxAmount * this.TREASURY_RATIO;
        const burnPart = taxAmount * this.BURN_RATIO;
        const revenuePart = taxAmount * this.REVENUE_RATIO;
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: senderId },
                data: { balance: { decrement: amount } },
            });
            await tx.user.update({
                where: { id: receiver.id },
                data: { balance: { increment: netAmount } },
            });
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                    circulatingSupply: { decrement: burnPart },
                },
            });
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
    async buy(userId, amount) {
        if (amount <= 0)
            throw new common_1.ConflictException('O valor deve ser maior que zero.');
        const taxAmount = amount * this.TAX_RATE;
        const netAmount = amount - taxAmount;
        const treasuryPart = taxAmount * this.TREASURY_RATIO;
        const burnPart = taxAmount * this.BURN_RATIO;
        const revenuePart = taxAmount * this.REVENUE_RATIO;
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: netAmount } },
            });
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    circulatingSupply: { increment: amount },
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                },
            });
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
    async sell(userId, amount) {
        if (amount <= 0)
            throw new common_1.ConflictException('O valor deve ser maior que zero.');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amount) {
            throw new common_1.ConflictException('Saldo insuficiente para venda.');
        }
        const taxAmount = amount * this.TAX_RATE;
        const netAmount = amount - taxAmount;
        const treasuryPart = taxAmount * this.TREASURY_RATIO;
        const burnPart = taxAmount * this.BURN_RATIO;
        const revenuePart = taxAmount * this.REVENUE_RATIO;
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } },
            });
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    circulatingSupply: { decrement: amount },
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                },
            });
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
    async chargeProtocolFee(userId, amount, actionType, description) {
        if (amount <= 0)
            return;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amount) {
            throw new common_1.ConflictException(`Saldo insuficiente para pagar a taxa de ${actionType}.`);
        }
        const treasuryPart = amount * this.TREASURY_RATIO;
        const burnPart = amount * this.BURN_RATIO;
        const revenuePart = amount * this.REVENUE_RATIO;
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } },
            });
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    treasuryBalance: { increment: treasuryPart },
                    totalBurned: { increment: burnPart },
                    operationalRevenue: { increment: revenuePart },
                    circulatingSupply: { decrement: burnPart },
                },
            });
            return await tx.transaction.create({
                data: {
                    senderId: userId,
                    receiverId: 'SYSTEM',
                    amount,
                    netAmount: 0,
                    taxAmount: amount,
                    type: actionType,
                    description,
                },
            });
        });
    }
    async issueReward(userId, amount, actionType, description) {
        if (amount <= 0)
            return;
        return await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } },
            });
            await tx.globalStats.update({
                where: { id: 'nexus_global_stats' },
                data: {
                    circulatingSupply: { increment: amount },
                },
            });
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
    async getHistory(userId) {
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
        const stats = await this.getGlobalStats();
        const INITIAL_PRICE = 0.5;
        const MAX_SUPPLY = 21000000;
        const circulatingSupply = stats.circulatingSupply || 1000000;
        const scarcityFactor = circulatingSupply / MAX_SUPPLY;
        const price = INITIAL_PRICE + (scarcityFactor * 10) * Math.pow(scarcityFactor + 1, 2);
        return { price };
    }
    async withdrawToChain(userId, amount, walletAddress) {
        if (amount <= 0)
            throw new common_1.BadRequestException('Valor inválido.');
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user || user.balance < amount) {
                throw new common_1.BadRequestException('Saldo insuficiente para o saque.');
            }
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } }
            });
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
};
exports.EconomyService = EconomyService;
exports.EconomyService = EconomyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EconomyService);
//# sourceMappingURL=economy.service.js.map