import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EconomyService } from '../economy/economy.service';

@Injectable()
export class HabitsService {
    private readonly HABIT_FEE = 3.0;

    constructor(
        private prisma: PrismaService,
        private economy: EconomyService
    ) { }

    async create(userId: string, data: Omit<Prisma.HabitCreateInput, 'user'>) {
        // 1. Charge protocol fee
        await this.economy.chargeProtocolFee(
            userId,
            this.HABIT_FEE,
            'HABIT_CREATE',
            `Taxa de criação de hábito: ${data.title}`
        );

        return this.prisma.habit.create({
            data: {
                ...data,
                currentValue: 0,
                completed: false,
                user: { connect: { id: userId } },
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.habit.findMany({
            where: { userId },
            include: { streak: true },
        });
    }

    async findOne(id: string) {
        return this.prisma.habit.findUnique({
            where: { id },
            include: { streak: true, progress: true },
        });
    }

    async remove(id: string) {
        return this.prisma.habit.delete({
            where: { id },
        });
    }
}
