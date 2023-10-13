import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Param, ParseUUIDPipe,
    Post,
    Query,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { Quote } from '../../entities/quote.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controller responsible for /quotes routes.
 */
@Controller('quotes')
@UseInterceptors(ClassSerializerInterceptor)
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) {}

    /**
     * Retrieves paginated quotes, sorted by the creation date.
     *
     * @param {number} page - Page number (default: 1).
     * @param {number} limit - Number of quotes per page (default: 10).
     * @param {string} userId - Optionally filter by user.
     * @returns {Promise<Quote[]>} - Paginated list of quotes.
     */
    @Get()
    async getQuotes(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('user') userId?: string,
    ): Promise<Quote[]> {
        return userId
            ? await this.quoteService.findByUserPaginated(userId, page, limit)
            : await this.quoteService.findPaginated(page, limit);
    }

    /**
     * Retrieves the list of most liked quotes.
     *
     * @param {number} page - Page number (default: 1).
     * @param {number} limit - Number of quotes per page (default: 10).
     * @param {string} userId - Optionally filter by user.
     * @returns {Promise<Quote[]>} - Paginated list of top quotes.
     */
    @Get('top')
    async getTopQuotes(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('user') userId?: string,
    ): Promise<Quote[]> {
        return userId
            ? await this.quoteService.findByTopScoreByUserPaginated(userId, page, limit)
            : await this.quoteService.findByTopScorePaginated(page, limit);
    }

    /**
     * Retrieves quotes, liked by this user.
     *
     * @param {string} userId - ID of the user.
     * @param {number} page - Page number (default: 1).
     * @param {number} limit - Number of quotes per page (default: 10).
     * @returns {Promise<Quote[]>} - Paginated list of quotes, liked by this user.
     */
    @Get('liked_by_user')
    async getQuotesLikedByUser(
        @Query('user') userId?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Quote[]> {
        return await this.quoteService.findQuotesLikedByUser(userId, page, limit);
    }

    /**
     * Retrieves the quote with the most likes that was
     * published today.
     *
     * @returns {Promise<Quote>} - Quote of the day.
     */
    @Get('quote_of_the_day')
    async getQuoteOfTheDay(): Promise<Quote> {
        return await this.quoteService.findQuoteOfTheDay();
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
     * @return {Promise<number>} - Returns a promise with the update quote score.
     */
    @Post(':id/vote')
    @UseGuards(JwtAuthGuard)
    async postVote(
        @Request() req,
        @Param('id', ParseUUIDPipe) id: string,
        @Query('vote') voteType?: string,
    ): Promise<number> {
        const quote: Quote = await this.quoteService.findById(id);
        if (!quote) throw new NotFoundException('Invalid quote ID');

        switch (voteType) {
            case null:
                await this.quoteService.clearVote(quote.id, req.user.id);
                break;
            case 'upvote':
                await this.quoteService.upvote(quote.id, req.user.id);
                break;
            case 'downvote':
                await this.quoteService.downvote(quote.id, req.user.id);
        }

        return this.quoteService.getScore(id);
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
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Quote> {
        return await this.quoteService.findById(id);
    }

}
