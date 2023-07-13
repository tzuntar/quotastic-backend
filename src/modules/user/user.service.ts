import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async addUser(createUserDto: CreateUserDto): Promise<User> {
        const hashed = await bcrypt.hash(createUserDto.password, 10);
        const data = { ...createUserDto, password: hashed };
        const user = this.userRepository.create(data);
        return await this.userRepository.save(user);
    }

    async getById(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async getByEmail(email: string): Promise<User> {
        return this.userRepository.findOneBy({ email });
    }

    async deleteUser(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }

    async userUpdate(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        if (updateUserDto.password != null) {
            const hashed = await bcrypt.hash(updateUserDto.password, 10);
            const data = { ...updateUserDto, password: hashed };
            await this.userRepository.update(id, data);
        } else {
            await this.userRepository.update(id, updateUserDto);
        }
        return this.getById(id);
    }
}
