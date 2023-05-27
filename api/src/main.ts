import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  app.enableCors({ origin: '*', credentials: true });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Netflop API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(process.env.PORT, () => {
    logger.log(`Server is listening on port ${process.env.PORT}`);
  });
}

bootstrap();
