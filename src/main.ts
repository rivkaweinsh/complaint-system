import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Complaint Service')
    .setDescription('Complaint Service API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const conf = app.get<ConfigService>(ConfigService);

  app.enableCors();

  // start app
  await app.listen(conf.get('port') || 4000);
}
bootstrap();
