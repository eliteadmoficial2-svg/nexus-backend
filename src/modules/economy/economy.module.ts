import { Module } from '@nestjs/common';
import { EconomyService } from './economy.service';
import { EconomyController } from './economy.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EconomyController],
    providers: [EconomyService],
    exports: [EconomyService],
})
export class EconomyModule { }
