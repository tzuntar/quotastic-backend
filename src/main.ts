import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true
    });
    const port: number = parseInt(process.env.PORT) || 8000;
    await app.listen(port);
}

bootstrap();
