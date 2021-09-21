import { PickType } from '@nestjs/swagger';
import { Users } from '../../../src/entities/Users.entity';

export class AuthDto extends PickType(Users, ['email', 'password']) {}
