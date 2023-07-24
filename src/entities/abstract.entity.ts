import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * An abstract entity all entities in this backend are supposed to derive from.
 */
export abstract class AbstractEntity {

    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    @Expose()
    id: string;

    @CreateDateColumn()
    @Expose()
    createdAt: Date;

    @UpdateDateColumn()
    @Expose()
    updatedAt: Date;

}