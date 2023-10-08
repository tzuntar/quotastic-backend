import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../annotations/roles.decorator';
import { RoleGuard } from '../auth/guards/role-guard.service';

@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @Roles('admin')
    async getAll(): Promise<User[]> {
        return this.userService.find();
    }

    @Get(':id')
    async getById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<User> {
        return this.userService.findById(id);
    }

    @Post()
    @Roles('admin')
    async addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Delete(':id')
    @Roles('admin')
    async deleteUser(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<DeleteResult> {
        return this.userService.delete(id);
    }

    @Patch(':id')
    @Roles('admin')
    async updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }
}
