import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EconomyModule } from '../economy/economy.module';

@Module({
  imports: [PrismaModule, EconomyModule],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule { }
