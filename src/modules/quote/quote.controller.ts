import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Post, Query,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Quote } from './entities/quote.entity';
import { QuoteReaction } from './entities/quote-reaction.entity';

/**
 * Controller responsible for /quotes routes.
 */
@Controller('quotes')
@UseGuards(JwtAuthGuard)
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
        @Query('limit') limit: number = 10
    ): Promise<Quote[]> {
        return await this.quoteService.findPaginated(page, limit);
    }

    /**
     * Upvotes this quote by the current user.
     *
     * @param {Request} req - Request with the current auth session.
     * @param {number} quoteId - Quote's ID.
     * @returns {Promise<QuoteReaction>} - Resulting reaction.
     */
    @Post(':id/upvote')
    async postQuoteUpvote(
        @Request() req,
        @Param('id') quoteId: number,
    ): Promise<QuoteReaction> {
        const quote: Quote = await this.quoteService.findOne(quoteId);
        if (!quote)
            throw new NotFoundException('Invalid quote ID');

        if (quote.user.id !== req.user.id)
            throw new UnauthorizedException('You are not authorized to update this quote');

        // ToDo: consider returning something like 'Already upvoted'
        return await this.quoteService.upvote(quote.id, req.user.id);
    }

    /**
     * Downvotes this quote by the current user.
     *
     * @param {Request} req - Current auth session.
     * @param {number} quoteId - Quote's ID.
     * @returns {Promise<QuoteReaction>} - Resulting reaction.
     */
    @Post(':id/downvote')
    async postQuoteDownvote(
        @Request() req,
        @Param('id') quoteId: number,
    ): Promise<QuoteReaction> {
        const quote: Quote = await this.quoteService.findOne(quoteId);
        if (!quote)
            throw new NotFoundException('Invalid quote ID');

        if (quote.user.id !== req.user.id)
            throw new UnauthorizedException('You are not authorized to update this quote');

        return await this.quoteService.downvote(quote.id, req.user.id);
    }

    /**
     * Retrieves the quote with this ID.
     *
     * @param {number} quoteId - Quote's ID.
     * @returns {Promise<Quote>} - Resulting quote.
     */
    @Get(':id')
    async getQuoteById(
        @Param('id') quoteId: number,
    ): Promise<Quote> {
        return await this.quoteService.findOne(quoteId);
    }

}
