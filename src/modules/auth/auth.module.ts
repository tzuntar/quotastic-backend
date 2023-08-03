import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: `${configService.get('JWT_SECRET_EXPIRATION')}s` },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
