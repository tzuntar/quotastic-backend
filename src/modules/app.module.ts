import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuoteModule } from './quote/quote.module';
import { RequestLoggingMiddleware } from '../middleware/request-logging.middleware';
import { configSchema } from '../config/config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from '../config/orm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '../.env'],
            validationSchema: configSchema,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => OrmConfig(configService),
        }),
        AuthModule,
        UserModule,
        QuoteModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(RequestLoggingMiddleware).forRoutes('*');
    }
}
