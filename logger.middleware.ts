import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction, response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = res;

      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    next();
  }
}
