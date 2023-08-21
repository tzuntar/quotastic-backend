import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { Quote } from './quote.entity';
import { Exclude } from 'class-transformer';
import { AbstractEntity } from './abstract.entity';

/**
 * Represents a User of the application.
 */
@Entity()
@Unique(['email'])
export class User extends AbstractEntity {

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ select: false, nullable: false })
    @Exclude()
    password: string;

    @Column({ default: 0 })
    karma: number;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ default: 0 })
    @Exclude()
    isAdmin: number;

    @Column({ nullable: true })
    @Exclude()
    jwtRefreshToken?: string;

    @OneToMany(() => Quote, (quote) => quote.user)
    quotes: Quote[];

}
