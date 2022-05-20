import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const serverConfig = config.get('server');

  const port = serverConfig.port || process.env.PORT;

  console.log('Nest server listening on port  ', port);
  await app.listen(port);
}
bootstrap();
