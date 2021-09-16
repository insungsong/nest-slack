import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //ExecutionContext은 http서버만 되는게 아니라 동시에 한 서버 안에서 rpc서버와 웹소켓등을 동시에 돌린다고 했을때, 하나의 실행컨텍스 안에서, 이중에서 가져오고 싶은걸 가져올 수 있다. 한번에 실행컨텍스트로 관리할 수 있다.
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
  },
);

//@Token() token과 같이 쓸 수 있다.
//res.locals.jwt를 쓰고 있으면 테스트 할 일도 생길 수 있고 express.fastify로 건너갈때가 할때
//이러한 res.locals.jwt로 쓰면 이 부분들을 일일이 찾아들어가서 수정해줘야한다 그래서 이런점에서 데코레이션을 만들어주는건 유리하다.
