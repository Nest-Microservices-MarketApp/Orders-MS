import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MS Orders - Bootstrap');
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  logger.log(`Orders Microservice running on port: ${envs.port}`);
}
bootstrap();
