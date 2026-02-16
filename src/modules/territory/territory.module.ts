import { Module } from '@nestjs/common';
import { TerritoryService } from './territory.service';
import { TerritoryController } from './territory.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EconomyModule } from '../economy/economy.module';
import { RunService } from './run.service';
import { RunController } from './run.controller';

@Module({
    imports: [PrismaModule, EconomyModule],
    controllers: [TerritoryController, RunController],
    providers: [TerritoryService, RunService],
    exports: [TerritoryService, RunService],
})
export class TerritoryModule { }
