import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Quote } from './quote.entity';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';
import { IsNotEmpty } from 'class-validator';

export enum QuoteReactionType {
    Upvote = 'upvote',
    Downvote = 'downvote',
}

/**
 * Represents a user-triggered reaction on a Quote.
 */
@Entity()
@Unique(['user', 'quote']) // safeguard to ensure one reaction per user per quote on the DB level
export class QuoteReaction extends AbstractEntity {

    @Column({ type: 'varchar', default: QuoteReactionType.Upvote })
    type: QuoteReactionType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user' })
    user: User;

    @ManyToOne(() => Quote, (quote) => quote.id)
    @JoinColumn({ name: 'quoteId' })
    @IsNotEmpty()
    quote: Quote;

}
