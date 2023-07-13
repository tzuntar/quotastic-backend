import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { CurrentUserController } from './current-user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [CurrentUserController, UserController],
    providers: [UserService],
})
export class UserModule {}
