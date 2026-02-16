import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HabitsModule } from './modules/habits/habits.module';
import { ProgressModule } from './modules/progress/progress.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { SocialModule } from './modules/social/social.module';
import { StoriesModule } from './modules/stories/stories.module';
import { TerritoryModule } from './modules/territory/territory.module';
import { EconomyModule } from './modules/economy/economy.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    HabitsModule,
    ProgressModule,
    RankingModule,
    ReportsModule,
    ActivitiesModule,
    SocialModule,
    StoriesModule,
    TerritoryModule,
    EconomyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
