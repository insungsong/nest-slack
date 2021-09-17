import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from 'logger.middleware';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { WorkspacesService } from './workspaces/workspaces.service';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ChannelMembers } from './entities/ChannelMembers.entity';
import { Channels } from './entities/Channels.entity';
import { DMs } from './entities/DMs.entity';
import { Mentions } from './entities/Mentions.entity';
import { Users } from './entities/Users.entity';
import { Workspaces } from './entities/Workspaces.entity';
import { WorkspaceMembers } from './entities/WorkspaceMembers.entity';
import { ChannelChats } from './entities/ChannelChats.entity';

//새로운 수정
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ChannelsModule,
    DmsModule,
    WorkspacesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, WorkspacesService], //nest는 java와 같이 의존성 주입을 해준다 이 의존성 주입을 해주는 부분이 providers부분이다.
  exports: [], //이 모듈에 새로 만들었는데 다른 모듈에서 쓰고 싶으면 exports안에다가 넣는다.
})
export class AppModule implements NestModule {
  //implements 반드시 구현해야하는 것을 의미한다.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  constructor(private connection: Connection) {}
}
