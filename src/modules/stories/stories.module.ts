import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EconomyModule } from '../economy/economy.module';

@Module({
    imports: [PrismaModule, EconomyModule],
    controllers: [StoriesController],
    providers: [StoriesService],
    exports: [StoriesService],
})
export class StoriesModule { }
