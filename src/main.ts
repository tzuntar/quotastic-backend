import {NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app/app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    await app.listen(8000);
}

bootstrap();
