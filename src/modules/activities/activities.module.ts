import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { RankingModule } from '../ranking/ranking.module';
import { EconomyModule } from '../economy/economy.module';

@Module({
  imports: [PrismaModule, UsersModule, RankingModule, EconomyModule],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
  exports: [ActivitiesService],
})
export class ActivitiesModule { }
