import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string
      | { error: string; statusCode: 400; message: string[] };

    if (typeof err !== 'string' && err.error === 'Bad Request') {
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }
    response.status(status).json({
      success: false,
      code: status,
      data: err,
    });
  }
}
