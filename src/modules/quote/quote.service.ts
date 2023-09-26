import { Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { QuoteReaction, QuoteReactionType } from '../../entities/quote-reaction.entity';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class QuoteService extends AbstractService<Quote> {
    constructor(
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>,
        @InjectRepository(QuoteReaction) private readonly quoteReactionRepository: Repository<QuoteReaction>,
    ) {
        super(quoteRepository);
    }

    override async findOne(options: FindOneOptions<Quote>): Promise<Quote> {
        return this.quoteRepository.findOne({
            select: {
                reactions: {
                    id: true,
                    type: true,
                    user: {
                        id: true,
                    },
                },
            },
            relations: {
                user: true,
                reactions: {
                    user: true,
                },
            },
            ...options,
        });
    }

    override async findById(id: string, options?: FindOneOptions<Quote>): Promise<Quote> {
        return this.quoteRepository.findOne({
            select: {
                reactions: {
                    id: true,
                    type: true,
                    user: {
                        id: true,
                    },
                },
            },
            relations: {
                user: true,
                reactions: {
                    user: true,
                },
            },
            where: { id },
            ...options,
        });
    }

    override async findPaginated(
        page: number = 1,
        limit: number = 10,
        options?: FindManyOptions<Quote>,
    ): Promise<Quote[]> {
        const skip = (page - 1) * limit;
        return this.quoteRepository.find({
            select: {
                reactions: {
                    id: true,
                    type: true,
                    user: {
                        id: true,
                    },
                },
            },
            order: {
                createdAt: 'DESC',
            },
            relations: {
                user: true,
                reactions: {
                    user: true,
                },
            },
            skip: skip,
            take: limit,
            ...options,
        });
    }

    override async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
        const quote: Quote = await this.quoteRepository.create({
            ...createQuoteDto,
            user: { id: createQuoteDto.userId },
        });
        return this.quoteRepository.save(quote);
    }

    override async update(id: string, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
        await this.quoteRepository.update(id, updateQuoteDto);
        return this.findOne({ where: { id } });
    }

    override async delete(id: string): Promise<DeleteResult> {
        return this.quoteRepository.delete({ id });
    }

    async findByUserPaginated(
        userId: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<Quote[]> {
        return this.findPaginated(page, limit, {
            where: {
                user: {
                    id: userId,
                },
            },
        });
    }

    async findByTopScorePaginated(
        page: number = 1,
        limit: number = 10
    ): Promise<Quote[]> {
        return this.findPaginated(page, limit, {
            where: {
                reactions: {
                    type: QuoteReactionType.Upvote,
                },
            },
            order: {
                reactions: { id: 'DESC' },
            },
        });
    }

    async findQuoteOfTheDay(): Promise<Quote> {
        const totalQuotes = await this.quoteRepository.count();
        const randIdx = Math.floor(Math.random() * totalQuotes);
        const quotes = await this.find({
            select: {
                reactions: {
                    id: true,
                    type: true,
                    user: {
                        id: true,
                    },
                },
            },
            order: {
                createdAt: 'DESC',
            },
            relations: {
                user: true,
                reactions: {
                    user: true,
                },
            },
            skip: randIdx,
            take: 1,
        });
        return quotes[0];
    }

    async getScore(quoteId: string): Promise<number> {
        const reactions = await this.quoteReactionRepository.find({
            where: {
                quote: { id: quoteId },
            },
        });

        return reactions.reduce((totalScore, reaction) => (
            reaction.type === 'upvote' ? totalScore + 1 :
                reaction.type === 'downvote' ? totalScore - 1 :
                    totalScore
        ), 0);
    }

    async upvote(id: string, userId: string): Promise<QuoteReaction> {
        await this.quoteReactionRepository.delete({
            user: { id: userId }, quote: { id: id },
        });
        const reaction: QuoteReaction = await this.quoteReactionRepository
            .create({
                quote: { id: id },
                user: { id: userId },
                type: QuoteReactionType.Upvote,
            });
        return this.quoteReactionRepository.save(reaction);
    }

    async downvote(id: string, userId: string): Promise<QuoteReaction> {
        await this.quoteReactionRepository.delete({
            user: { id: userId }, quote: { id: id },
        });
        const reaction: QuoteReaction = await this.quoteReactionRepository
            .create({
                quote: { id: id },
                user: { id: userId },
                type: QuoteReactionType.Downvote,
            });
        return this.quoteReactionRepository.save(reaction);
    }

    async clearVote(id: string, userId: string): Promise<void> {
        await this.quoteReactionRepository.delete({
            user: { id: userId }, id: id,
        });
    }

}
