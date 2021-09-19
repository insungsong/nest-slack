import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async validateUser(@Body() body: AuthDto): Promise<any> {
    const result = await this.authService.validateUser(
      body.email,
      body.password,
    );
    return result;
  }
}
