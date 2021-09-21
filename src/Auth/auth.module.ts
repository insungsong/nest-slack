import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../src/entities/Users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
