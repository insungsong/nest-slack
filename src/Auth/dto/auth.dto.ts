import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { Users } from 'src/entities/Users.entity';

export class AuthDto extends PickType(Users, ['email', 'password']) {}
