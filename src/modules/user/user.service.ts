import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class UserService extends AbstractService<User> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {
        super(userRepository);
    }

    override async create(createUserDto: CreateUserDto): Promise<User> {
        const hashed = await bcrypt.hash(createUserDto.password, 10);
        const data = { ...createUserDto, password: hashed };
        const user = this.userRepository.create(data);
        return await this.userRepository.save(user);
    }

    override async findById(id: string, options?: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOne({ where: { id }, ...options });
    }

    async findByEmail(email: string, options?: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOne({ where: { email }, ...options });
    }

    override async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        if (updateUserDto.password != null) {
            const hashed = await bcrypt.hash(updateUserDto.password, 10);
            const data = { ...updateUserDto, password: hashed };
            await this.userRepository.update(id, data);
        } else {
            await this.userRepository.update(id, updateUserDto);
        }
        return this.findById(id);
    }

    async delete(id: string): Promise<DeleteResult> {
        return this.userRepository.delete({ id });
    }
}
