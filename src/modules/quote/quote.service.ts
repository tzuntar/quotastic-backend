import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from './entities/quote.entity';
import { DeleteResult, Repository } from 'typeorm';
import { QuoteReaction, QuoteReactionType } from './entities/quote-reaction.entity';
import { QuoteReactionDto } from './dto/quote-reaction.dto';

@Injectable()
export class QuoteService {
    constructor(
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>,
        @InjectRepository(QuoteReaction) private readonly quoteReactionRepository: Repository<QuoteReaction>,
    ) {}

    async findOne(id: number): Promise<Quote> {
        return this.quoteRepository.findOne({
            where: { id },
            relations: {
                user: true,
            },
        });
    }

    async findPaginated(page: number, limit: number): Promise<Quote[]> {
        const skip = (page - 1) * limit;
        return this.quoteRepository.find({
            relations: {
                reactions: true,
                user: true,
            },
            skip: skip,
            take: limit,
        });
    }

    async create(createQuoteDto: CreateQuoteDto, userId: number): Promise<Quote> {
        const quote: Quote = await this.quoteRepository.create({
            ...createQuoteDto,
            user: { id: userId },
        });
        return this.quoteRepository.save(quote);
    }

    async update(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
        await this.quoteRepository.update(id, updateQuoteDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.quoteRepository.delete({ id });
    }

    async upvote(id: number, userId: number): Promise<QuoteReaction> {
        await this.quoteReactionRepository.delete({
            user: { id: userId }, id: id,
        });
        const dto: QuoteReactionDto = {
            userId: userId,
            type: QuoteReactionType.Upvote,
        };
        const reaction: QuoteReaction = await this.quoteReactionRepository
            .create(dto);
        if (!reaction) throw new BadRequestException('Cannot upvote');
        return reaction;
    }

    async downvote(id: number, userId: number): Promise<QuoteReaction> {
        await this.quoteReactionRepository.delete({
            user: { id: userId }, id: id,
        });
        const dto: QuoteReactionDto = {
            userId: userId,
            type: QuoteReactionType.Downvote,
        };
        const reaction: QuoteReaction = await this.quoteReactionRepository
            .create(dto);
        if (!reaction) throw new BadRequestException('Cannot downvote');
        return reaction;
    }

}
