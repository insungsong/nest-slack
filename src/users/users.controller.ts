import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { JoinRequestDto } from './dto/join.reqeust.dto';
import { UsersService } from './users.service';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiResponse({ type: UserDto })
  @ApiResponse({ status: 500, description: '서버에러' })
  @ApiResponse({ type: UserDto, status: 200, description: '성공' })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    //jwt를 쓰면, res.locals.jwt express에서는 미들웨어간의 공유를 해줄 수 있는게 res.locals이다.
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  join(@Body() data: JoinRequestDto) {
    console.log('???');
    return this.userService.join(data.email, data.nickname, data.password);
  }

  @ApiResponse({ type: UserDto, status: 200, description: '성공' })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
