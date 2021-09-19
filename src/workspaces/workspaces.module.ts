import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers.entity';
import { Channels } from 'src/entities/Channels.entity';
import { Users } from 'src/entities/Users.entity';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity';
import { Workspaces } from 'src/entities/Workspaces.entity';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceMembers,
      Workspaces,
      ChannelMembers,
      Channels,
      Users,
    ]),
  ],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}
