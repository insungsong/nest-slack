import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { ChannelMembers } from 'src/entities/ChannelMembers.entity';
import { Channels } from 'src/entities/Channels.entity';
import { Users } from 'src/entities/Users.entity';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity';
import { Workspaces } from 'src/entities/Workspaces.entity';
import { getConnection, Repository } from 'typeorm';

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
    private readonly channerMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private readonly usersRepostory: Repository<Users>,
  ) {}
  async findById(id: number) {
    return this.workspaceRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspaceRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // const workspace = this.workspaceRepository.create({
      //   name,
      //   url,
      //   OwnerId: myId,
      // });
      const workspace = queryRunner.manager.getRepository(Workspaces).create({
        name,
        url,
        OwnerId: myId,
      });

      // const returned = await this.workspaceRepository.save(workspace);

      const returned = await queryRunner.manager
        .getRepository(Workspaces)
        .save(workspace);

      const workspaceMember = new WorkspaceMembers();

      workspaceMember.UserId = myId;
      workspaceMember.WorkspaceId = returned.id;
      // await this.workspaceMembersRepository.save(workspaceMember);
      await queryRunner.manager
        .getRepository(WorkspaceMembers)
        .save(workspaceMember);

      const channel = new Channels();
      channel.name = '일반';
      channel.WorkspaceId = returned.id;

      // const channelReturned = await this.channelsRepository.save(channel);
      const channelReturned = await queryRunner.manager
        .getRepository(Channels)
        .save(channel);

      const channelMember = new ChannelMembers();

      channelMember.UserId = myId;
      channelMember.ChannelId = channelReturned.id;

      // await this.channerMembersRepository.save(channelMember);
      await queryRunner.manager
        .getRepository(ChannelMembers)
        .save(channelMember);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
}
