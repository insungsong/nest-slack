import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers.entity';
import { Channels } from 'src/entities/Channels.entity';
import { Users } from 'src/entities/Users.entity';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity';
import { Workspaces } from 'src/entities/Workspaces.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private readonly workspaceRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private readonly channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private readonly workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private readonly channerRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private readonly usersRepostory: Repository<Users>,
  ) {}
  async hi() {
    return await this.workspaceRepository.find();
  }
}
