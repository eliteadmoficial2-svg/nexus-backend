import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EconomyModule } from '../economy/economy.module';

@Module({
    imports: [PrismaModule, EconomyModule],
    controllers: [SocialController],
    providers: [SocialService],
    exports: [SocialService],
})
export class SocialModule { }
