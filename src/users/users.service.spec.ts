import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelMembers } from '../../src/entities/ChannelMembers.entity';
import { Users } from '../../src/entities/Users.entity';
import { WorkspaceMembers } from '../../src/entities/WorkspaceMembers.entity';
import { UsersService } from './users.service';

class MockUserRepository {
  #data = [{ id: 1, email: 'song22861@naver.com' }];

  findOne({ where: { email } }) {
    const data = this.#data.find((item) => item.email === email);
    if (data) {
      return data;
    }

    return null;
  }
}
class MockWorkspaceMembersRepository {}
class MockChannelMembersRepository {}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, // UsersService === {provide: UsersService,useClass: UsersService} 실제값과 실제 객체가 같기때문에 UsersService라는것 만으로도 가능한 것이다.
        {
          //실제값과 모킹값이 다른경우에 provide와 useClass를 각각 써줘야한다.
          provide: getRepositoryToken(Users), //실제값
          useClass: MockUserRepository, //모킹값 여기가 실제값과 같으면 18line처럼 사용할 수 있다.
          //useClass = 클래스 / useFactory = 함수 / useValue = 값
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail은 이메일을 통해 유저를 찾아야함', () => {
    expect(service.findByEmail('song22861@naver.com')).resolves.toBe({
      //async 함수는 Promise를 반환하는데 이때 resolves함수를 사용해주면 된다.
      email: 'song22861@naver.com',
      id: 1,
    });
  });

  it('findByEmail은 유저를 못찾으면 null을 반환해야함', () => {
    expect(service.findByEmail('song22861@na.com')).resolves.toBe(null);
  });

  //미래에 만들 테스트는
  it.todo('findByEmail은 유저를 못찾으면 null을 반환해야함');
});
