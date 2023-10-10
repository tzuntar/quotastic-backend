import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeleteResult, FindOneOptions, Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import {User} from '../../entities/user.entity';
import {AbstractService} from '../common/abstract.service';
import {ScoreDataDto} from "./dto/score-data.dto";

@Injectable()
export class UserService extends AbstractService<User> {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {
        super(userRepository);
    }

    override async create(createUserDto: CreateUserDto): Promise<User> {
        const hashed = await bcrypt.hash(createUserDto.password, 10);
        const data = {...createUserDto, password: hashed};
        const user = this.userRepository.create(data);
        return await this.userRepository.save(user);
    }

    override async findById(id: string, options?: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOne({where: {id}, ...options});
    }

    async findByEmail(email: string, options?: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOne({where: {email}, ...options});
    }

    override async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        if (updateUserDto.password != null) {
            const hashed = await bcrypt.hash(updateUserDto.password, 10);
            const data = {...updateUserDto, password: hashed};
            await this.userRepository.update(id, data);
        } else {
            await this.userRepository.update(id, updateUserDto);
        }
        return this.findById(id);
    }

    async delete(id: string): Promise<DeleteResult> {
        return this.userRepository.delete({id});
    }

    /**
     * Returns user karma and quote count.
     * @param id {string} - ID of the user to fetch the data for.
     */
    async getScoreByUserId(id: string): Promise<ScoreDataDto> {
        const user = await this.userRepository.createQueryBuilder('user')
            .select('user.karma')
            .where('user.id = :id', {id})
            .getOne();
        if (!user)
            throw new NotFoundException('User not found')
        const quotesCount = await this.userRepository.createQueryBuilder('user')
            .leftJoin('user.quotes', 'quotes')
            .where('user.id = :id', {id})
            .getCount();

        return {
            karma: user.karma,
            quotesCount,
        }
    }
}
