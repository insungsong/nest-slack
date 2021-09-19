import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionsFilter } from './httpException.filter';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionsFilter());

  console.log(`:) Listening on port ${port}`);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  const config = new DocumentBuilder()
    .setTitle('Slack API')
    .setDescription('slack 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();

  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
