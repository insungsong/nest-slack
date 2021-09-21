import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'diagnostics_channel';
import { NotFoundError } from 'rxjs';
import { ChannelChats } from '../../src/entities/ChannelChats.entity';
import { ChannelMembers } from '../../src/entities/ChannelMembers.entity';
import { Channels } from '../../src/entities/Channels.entity';
import { Users } from '../../src/entities/Users.entity';
import { WorkspaceMembers } from '../../src/entities/WorkspaceMembers.entity';
import { Workspaces } from '../../src/entities/Workspaces.entity';
import { EventGateway } from '../../src/event/event.gateway';
import { MoreThan, Not, Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
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
    @InjectRepository(ChannelChats)
    private readonly channelChatsRepository: Repository<ChannelChats>,
    private eventsGateway: EventGateway,
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id: id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'ChannelMembers',
        'ChannelMembers.userId = :userId',
        { userId: myId },
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url: url },
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository.findOne({
      where: {
        name,
      },
      relations: ['Workspace'],
    });
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { url: url },
    });
    const channel = new Channels();
    channel.name = name;
    channel.WorkspaceId = workspace.id;

    const channelReturned = await this.channelsRepository.save(channel);

    const channelMember = new ChannelMembers();

    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;

    await this.channelsRepository.save(channelMember);
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return await this.usersRepostory
      .createQueryBuilder('user')
      .innerJoin('user.Channels', ',channels', 'channels.name = :name', {
        name: name,
      })
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      })
      .getMany();
  }

  async createWorkspaceChannelMembers(
    url: string,
    name: string,
    email: string,
  ) {
    const channels = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      })
      .where('channel.name = :name', { name: name })
      .getOne();

    if (!channels) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    const user = await this.usersRepostory
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
        url: url,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channels.id;
    channelMember.UserId = user.id;

    await this.channerMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
        //인덱스 걸기
        name: name,
      })
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        //인덱스 걸기
        url: url,
      })
      .innerJoinAndSelect('channelChats.User', 'user')
      .orderBy('channelChats.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async getChannelUnreadsCount(url: string, name: string, after) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'Workspace.url = :url', {
        url: url,
      })
      .where('channel.name = :name', { name: name })
      .getOne();

    return this.channelChatsRepository.count({
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)), //createdAt  > '2021-09-12'
      },
    });
  }

  async postChat({ url, name, content, myId }) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      })
      .where('channel.name = :name', { name: name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    const chats = new ChannelChats();

    chats.content = content;
    chats.UserId = myId;
    chats.ChannelId = channel.id;

    const saveChat = await this.channelChatsRepository.save(chats);

    // 1안
    // saveChat.Channel = channel;
    // saveChat.User = user;

    //2안
    const chatWithUser = await this.channelsRepository.findOne({
      where: {
        id: saveChat.id,
      },
      relations: ['User', 'Channel'],
    });

    this.eventsGateway.server
      .to(`/ws-${url}-${channel.id}`)
      .emit('message', chatWithUser);
  }

  async createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    myId: number,
  ) {
    console.log('files:', files);
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      })
      .where('channel.name = :name', { name: name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }
    for (let i = 0; i < files.length; i++) {
      const chats = new ChannelChats();
      chats.content = files[i].path;
      chats.UserId = myId;
      chats.ChannelId = channel.id;
      const saveChat = await this.channelChatsRepository.save(chats);

      const chatWithUser = await this.channelChatsRepository.findOne({
        where: {
          id: saveChat.id,
        },
        relations: ['User', 'Channel'],
      });

      this.eventsGateway.server
        .to(`/ws-${url}-${chatWithUser.ChannelId}`)
        .emit('message', chatWithUser);
    }
  }
}
