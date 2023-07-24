import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { QuoteReactionType } from '../../../entities/quote-reaction.entity';

export class QuoteReactionDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['upvote', 'downvote'])
    type: QuoteReactionType;

    @IsNotEmpty()
    @IsString()
    userId: string;
}