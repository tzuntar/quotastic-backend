import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserController } from './current-user.controller';
import { User } from '../../entities/user.entity';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [CurrentUserController, UserController],
    providers: [UserService, AuthService],
})
export class UserModule {}
