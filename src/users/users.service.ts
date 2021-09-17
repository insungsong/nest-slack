import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async join(email: string, password: string, nickname: string) {
    try {
      if (!email) {
        //이메일 없다고 에러
        throw new Error('이미 존재하는 사용자입니다.');
      }
      if (!nickname) {
        throw new Error('닉네임이 없네요.');
      }

      if (!password) {
        throw new Error('비밀번호가 없네요');
      }
      const user = this.usersRepository.findOne({ where: { email } });
      if (user) {
        //이미 존재하는 유저라고 에러
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      await this.usersRepository.save({
        email,
        nickname,
        password: hashedPassword,
      });
    } catch (e) {
      this.logger.log('postUsers Error: ', e);
    }
  }
}
