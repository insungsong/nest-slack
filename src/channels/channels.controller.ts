import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users.entity';
import { ChannelsService } from './channels.service';
import { PostChatDto } from './dto/postchat.dto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

try {
  fs.readdirSync('uploads');
} catch (e) {
  console.log('uploads 폴더가 없어 uploads폴더를 생성합니다.');
  fs.mkdirSync('updloads');
}
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

  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post(':name/image')
  postImage(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('url') url: string,
    @Param('name') name: string,
    @User() user,
  ) {
    return this.channelsServcie.createWorkspaceChannelImages(
      url,
      name,
      files,
      user.id,
    );
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
