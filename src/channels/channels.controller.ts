import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users.entity';
import { ChannelsService } from './channels.service';
import { PostChatDto } from './dto/postchat.dto';

@ApiTags('Channels')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private readonly channelsServcie: ChannelsService) {}

  @Get(':name/channels')
  getAllChannels(@Param('url') url: string, @User() user) {
    return this.channelsServcie.getWorkspaceChannels(url, user.id);
  }

  @Post()
  createChannels() {}

  @Get(':name')
  getSpecificChannel(@Param('id', ParseIntPipe) id: string) {}

  @Get(':name/chats')
  getChats(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query() query,
    @Param() param,
  ) {
    return this.channelsServcie.getWorkspaceChannelChats(
      url,
      name,
      query.perPage,
      query.page,
    );
  }

  @Post(':name/chats')
  postChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() body: PostChatDto,
    @User() user,
  ) {
    return this.channelsServcie.postChat({
      url,
      name,
      content: body.content,
      myId: user.id,
    });
  }

  @Post(':name/image')
  postImage(@Body() body) {
    // return this.channelsServcie.
  }

  @Get(':/name/unreads')
  getUnreads(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query('after') after: number,
  ) {
    return this.channelsServcie.getChannelUnreadsCount(url, name, after);
  }

  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsServcie.getWorkspaceChannelMembers(url, name);
  }

  @Post(':name/members')
  inviteMembers() {}
}
