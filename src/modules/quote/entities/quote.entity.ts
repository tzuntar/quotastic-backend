import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { QuoteReaction } from './quote-reaction.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Quote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @Column({ default: 0 })
    cachedScore?: number;

    @ManyToOne(() => User, (user) => user.quotes)
    @JoinColumn({name: 'userId' })
    user: User;

    @ManyToOne(() => QuoteReaction, (reaction) => reaction.quote)
    reactions: QuoteReaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
