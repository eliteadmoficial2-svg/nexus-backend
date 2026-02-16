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
exports.HabitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const economy_service_1 = require("../economy/economy.service");
let HabitsService = class HabitsService {
    prisma;
    economy;
    HABIT_FEE = 3.0;
    constructor(prisma, economy) {
        this.prisma = prisma;
        this.economy = economy;
    }
    async create(userId, data) {
        await this.economy.chargeProtocolFee(userId, this.HABIT_FEE, 'HABIT_CREATE', `Taxa de criação de hábito: ${data.title}`);
        return this.prisma.habit.create({
            data: {
                ...data,
                currentValue: 0,
                completed: false,
                user: { connect: { id: userId } },
            },
        });
    }
    async findAll(userId) {
        return this.prisma.habit.findMany({
            where: { userId },
            include: { streak: true },
        });
    }
    async findOne(id) {
        return this.prisma.habit.findUnique({
            where: { id },
            include: { streak: true, progress: true },
        });
    }
    async remove(id) {
        return this.prisma.habit.delete({
            where: { id },
        });
    }
};
exports.HabitsService = HabitsService;
exports.HabitsService = HabitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        economy_service_1.EconomyService])
], HabitsService);
//# sourceMappingURL=habits.service.js.map