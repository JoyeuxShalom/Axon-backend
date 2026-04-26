import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // --- SWAGGER API DOCUMENTATION SETUP ---
  const config = new DocumentBuilder()
    .setTitle('Axon Medical API')
    .setDescription('The central backend API for the Axon Web Dashboard and Mobile App.')
    .setVersion('1.0')
    .addBearerAuth() // Tells Swagger we use JWT Bearer tokens
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // This hosts the documentation at http://localhost:3001/api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log(`Axon Backend API running on http://localhost:3001`);
  console.log(`API Documentation available at http://localhost:3001/api/docs`);
}
bootstrap();