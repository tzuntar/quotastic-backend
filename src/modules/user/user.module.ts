import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserController } from './current-user.controller';
import { User } from '../../entities/user.entity';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => AuthModule),
    ],
    controllers: [CurrentUserController, UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
