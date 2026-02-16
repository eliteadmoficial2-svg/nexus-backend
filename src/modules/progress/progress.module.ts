import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { RankingModule } from '../ranking/ranking.module';

import { EconomyModule } from '../economy/economy.module';

@Module({
  imports: [RankingModule, EconomyModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule { }
