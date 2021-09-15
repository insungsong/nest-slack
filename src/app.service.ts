import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTest() {
    return process.env.PORT;
  }
}
