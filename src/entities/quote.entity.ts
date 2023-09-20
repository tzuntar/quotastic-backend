import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { QuoteReaction } from './quote-reaction.entity';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';
import { IsNotEmpty } from 'class-validator';

/**
 * Represents a user-created Quote.
 */
@Entity()
export class Quote extends AbstractEntity {

    @Column({ nullable: false })
    body: string;

    @Column({ default: 0 })
    cachedScore?: number;

    @ManyToOne(() => User, (user) => user.quotes)
    @JoinColumn({ name: 'user' })
    @IsNotEmpty()
    user: User;

    @OneToMany(() => QuoteReaction, (reaction) => reaction.quote)
    reactions: QuoteReaction[];

}
