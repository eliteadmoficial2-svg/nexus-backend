import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TitlesService } from './titles.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TitlesService],
  exports: [UsersService, TitlesService],
})
export class UsersModule { }
