import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from 'logger.middleware';

//새로운 수정
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService], //nest는 java와 같이 의존성 주입을 해준다 이 의존성 주입을 해주는 부분이 providers부분이다.
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
