import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../src/entities/Users.entity';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity';
import { ChannelMembers } from 'src/entities/ChannelMembers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
