import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { UserQuoteController } from './user-quote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { QuoteReaction } from '../../entities/quote-reaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quote, QuoteReaction])],
    controllers: [QuoteController, UserQuoteController],
    providers: [QuoteService],
})
export class QuoteModule {}
