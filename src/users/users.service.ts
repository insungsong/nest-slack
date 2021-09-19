import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Connection, getConnection, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JoinRequestDto } from './dto/join.reqeust.dto';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity';
import { ChannelMembers } from 'src/entities/ChannelMembers.entity';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private readonly workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private readonly channelMembersRepository: Repository<ChannelMembers>,
    private readonly connection: Connection,
  ) {}

  async authorUser() {
    try {
    } catch (e) {
      console.log('authorUser Error: ', e);
    }
  }

  async join(joinData: JoinRequestDto): Promise<any> {
    const { email, nickname, password } = joinData;

    const user = await this.usersRepository.findOne({ where: { email } });
    console.log('user: ', user);
    if (user) {
      return new UnauthorizedException('이미 존재하는 사용자 입니다.');
    }

    const queryRunner = this.connection.createQueryRunner();
    try {
      //연결 맺어주고
      await queryRunner.connect();
      //tranction = 거래라는 뜻이야 그래서, 모든게 통과하면 바꿔주고 한개라도 실패하면 롤백시키고
      await queryRunner.startTransaction();

      const hashedPassword = await bcrypt.hash(password, 10);

      //이렇게 쓸 경우에는 트렌젹션을 통해서 열어둔 db로 연결되는게 아니라, app.modules에서 설정한 typrorm config에 들어감으로 바꾸어야한다.
      // const returned = await this.usersRepository.save({
      //   email,
      //   nickname,
      //   password: hashedPassword,
      // });

      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });

      // 마찬가지 이유로, this.workspaceMembersRepository로 하면 transation에 연결된 db로 연결되지 않음으로 바꾸어주어야함
      // await this.workspaceMembersRepository.save({
      //   UserId: returned.id,
      //   WorkspaceId: returned.id,
      // });
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: returned.id,
        WorkspaceId: 1,
      });

      //마찬가지 이유로 transation과 연결되지 않음
      // await this.channelMembersRepository.save({
      //   UserId: returned.id,
      //   ChannelId: returned.id,
      // });

      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1,
      });

      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      this.logger.log('postUsers Error: ', e);
      await queryRunner.rollbackTransaction();
    } finally {
      //디비에는 최대 연결 계수가 있기떄문에 연결을 끊어주어야한다.
      await queryRunner.release();
    }
  }
}
