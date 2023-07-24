import { BadRequestException, Injectable } from '@nestjs/common';
import { DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AbstractEntity } from '../../entities/abstract.entity';

@Injectable()
export abstract class AbstractService<T extends AbstractEntity> {
    protected constructor(protected readonly repository: Repository<T>) {}

    async find(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<T>): Promise<T> {
        return this.repository.findOne(options);
    }

    abstract findById(id: string, options?: FindOneOptions<T>): Promise<T>;

    async findPaginated(
        page: number = 1,
        limit: number = 10,
        options?: FindManyOptions<T>,
    ): Promise<T[]> {
        if (page < 1) throw new BadRequestException('Pages start at 1.');
        const skip = (page - 1) * limit;
        return this.repository.find({
            skip: skip,
            take: limit,
            ...options,
        });
    }

    abstract create(dto): Promise<T>;

    abstract update(id: string, dto): Promise<T>;

    abstract delete(id: string): Promise<DeleteResult>;

}
