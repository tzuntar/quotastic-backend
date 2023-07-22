import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Quote } from './quote.entity';
import { User } from '../../user/entity/user.entity';

export enum QuoteReactionType {
    Upvote = 'upvote',
    Downvote = 'downvote',
}

@Entity()
@Unique(['user', 'quote']) // safeguard to ensure one reaction per user per quote on the DB level
export class QuoteReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', default: QuoteReactionType.Upvote })
    type: QuoteReactionType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Quote, (quote) => quote.reactions)
    @JoinColumn({ name: 'quoteId' })
    quote: Quote;
}
