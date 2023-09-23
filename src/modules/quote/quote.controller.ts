import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    Request, UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { Quote } from '../../entities/quote.entity';
import { QuoteReaction, QuoteReactionType } from '../../entities/quote-reaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controller responsible for /quotes routes.
 */
@Controller('quotes')
@UseInterceptors(ClassSerializerInterceptor)
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) {}

    /**
     * Retrieves paginated quotes.
     *
     * @param {number} page - Page number (default: 1).
     * @param {number} limit - Number of quotes per page (default: 10).
     * @returns {Promise<Quote[]>} - Paginated list of quotes.
     */
    @Get()
    async getQuotes(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Quote[]> {
        return await this.quoteService.findPaginated(page, limit);
    }

    /**
     * Retrieves the list of most liked quotes.
     *
     * @param {number} page - Page number (default: 1).
     * @param {number} limit - Number of quotes per page (default: 10).
     * @returns {Promise<Quote[]>} - Paginated list of top quotes.
     */
    @Get('top')
    async getTopQuotes(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Quote[]> {
        return await this.quoteService.findPaginated(page, limit, {
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

    /**
     * Casts a vote on this quote.
     * The vote can either be an upvote or a downvote.
     * Leaving out the 'vote' parameter clears the vote.
     *
     * @param {Request} req - Request with the current auth session.
     * @param {string} id - Quote's ID.
     * @param {'upvote' | 'downvote' | null} voteType - The vote to cast or
     * 'null' to clear any existing vote.
     */
    @Post(':id/vote')
    @UseGuards(JwtAuthGuard)
    async postVote(
        @Request() req,
        @Param('id') id: string,
        @Query('vote') voteType?: string,
    ): Promise<QuoteReaction | void> {
        const quote: Quote = await this.quoteService.findById(id);
        if (!quote) throw new NotFoundException('Invalid quote ID');
        switch (voteType) {
            case null:
                return await this.quoteService.clearVote(quote.id, req.user.id);
            case 'upvote':
                return await this.quoteService.upvote(quote.id, req.user.id);
            case 'downvote':
                return await this.quoteService.downvote(quote.id, req.user.id);
        }
    }

    /**
     * Retrieves the quote with this ID.
     *
     * @param {string} id - Quote's ID.
     * @returns {Promise<Quote>} - Resulting quote.
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getQuoteById(
        @Param('id') id: string,
    ): Promise<Quote> {
        return await this.quoteService.findById(id);
    }

}
