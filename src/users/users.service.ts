import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  async postUsers(email: string, password: string, nickname: string) {
    try {
    } catch (e) {
      this.logger.log('postUsers Error: ', e);
    }
  }
}
