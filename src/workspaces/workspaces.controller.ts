import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';

@ApiTags('Workspaces')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}
  @Get()
  getMyWorkspaces() {
    return this.workspacesService.hi();
  }

  @Post()
  createWorkspaces() {}

  @Get(':url/members')
  getAllMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
