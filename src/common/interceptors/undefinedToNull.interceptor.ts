import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //공통되는 앞 부분

    //공통되는 마지막 부분을 열거함
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
  }
}
