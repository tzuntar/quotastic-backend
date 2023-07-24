import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

export const OrmConfig = async (configService: ConfigService): Promise<ConnectionOptions> => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST') || 'localhost',
    port: parseInt(configService.get('DATABASE_PORT')) || 5432,
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [],   // 'dist/**/*.entity.js'
    migrations: [__dirname + '../../migrations/**/*.entity{.ts,.js}'],
    synchronize: true,
});