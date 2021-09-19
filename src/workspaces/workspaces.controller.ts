import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users.entity';
import { CreateWorkSpaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('Workspaces')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}
  @Get(':/myId')
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findById(user.id);
  }

  @Post()
  createWorkspaces(@User() user: Users, @Body() body: CreateWorkSpaceDto) {
    return this.workspacesService;
  }

  @Get(':url/members')
  getAllMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
