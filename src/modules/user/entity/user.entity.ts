import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Quote } from '../../quote/entities/quote.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column({ select: false })
    @Exclude()
    password?: string;

    @Column({ default: 0 })
    karma?: number;

    @Column({ nullable: true })
    avatarUrl?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @Column({ default: 0, select: false })
    @Exclude()
    isAdmin?: number;

    @OneToMany(() => Quote, (quote) => quote.user)
    quotes: Quote[];
}
