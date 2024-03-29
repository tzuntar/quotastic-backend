import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

export const OrmConfig = async (configService: ConfigService): Promise<ConnectionOptions> => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST') || 'localhost',
    port: parseInt(configService.get('DATABASE_PORT')) || 5432,
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASS'),
    database: configService.get('DATABASE_NAME'),
    entities: [__dirname + '../../entities/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '../../migrations/**/*.entity{.ts,.js}'],
    logging: true,
    synchronize: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});