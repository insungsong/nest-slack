import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService) {
  //   this.appService = AppService;
  // }

  //위처럼 선언해야, this.appService를 원래는 쓸 수 있는게 맞다.
  //그러나 constructor(private readonly appService: AppService) 를 해줌으로써 즉 타입을 지정해줌으로써
  //this.appService = AppService없이도 해당 부분을 진행해주는 것이다. 이건 nest의 기능! app.modules.ts에서 prividers에 의존성 주입으로 appService를 해주었기때문에 가능한것이다.
  //app.modules.ts에 Appservice를 DI를 만들어줌으로써, 외부에서 객체를 가져온다 이렇게 됐을때 좋은점은 객체를 한번 더 생성하면서 메모리를 낭비하지 않을 수 있다.
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return 'Hello,world!';
  }
}
