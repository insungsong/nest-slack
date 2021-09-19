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

      // await queryRunner.manager
      //   .getRepository(WorkspaceMembers)
      //   .save(workspaceMember);

      const channel = new Channels();
      channel.name = '일반';
      channel.WorkspaceId = returned.id;

      // const channelReturned = await this.channelsRepository.save(channel);

      //코드 동시에 두개 실행시켜주기
      const [_, channelReturned] = await Promise.all([
        queryRunner.manager
          .getRepository(WorkspaceMembers)
          .save(workspaceMember),

        queryRunner.manager.getRepository(Channels).save(channel),
      ]);

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

  //TO DO: transaction화 해야함
  async getWorkspaceMembers(url: string) {
    await this.usersRepostory
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspaces', 'workspaces')
      .where('workspaces.url = :url', { url: url })
      .getMany();
  }

  async createWorkspaceMembers(url: string, email: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: {
        url: url,
      },
      relations: ['Channels'],
    });

    const user = await this.usersRepostory.findOne({ email: email });
    if (!user) {
      return null;
    }

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;

    await this.workspaceMembersRepository.save(workspaceMember);

    const channelMember = new ChannelMembers();

    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;

    await this.channerMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return await this.usersRepostory
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url: url,
      })
      .getOne();
  }
}
