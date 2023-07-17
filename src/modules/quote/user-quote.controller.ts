import {
    Body,
    Controller,
    NotFoundException,
    Param,
    Patch,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Quote } from './entities/quote.entity';
import { UpdateQuoteDto } from './dto/update-quote.dto';

/**
 * Controller responsible for quote-related /me routes.
 */
@Controller('me')
@UseGuards(JwtAuthGuard)
export class UserQuoteController {
    constructor(private readonly quoteService: QuoteService) {}

    /**
     * Posts a quote by the current user.
     *
     * @param {Request} req - Request with the current auth session.
     * @param {CreateQuoteDto} createQuoteDto - New quote data.
     * @returns {Promise<Quote>} - Resulting newly created quote.
     */
    @Post('myquote')
    async postOwnQuote(
        @Request() req,
        @Body() createQuoteDto: CreateQuoteDto,
    ): Promise<Quote> {
        return this.quoteService.create(createQuoteDto, req.user.id);
    }

    /**
     * Updates a quote owned by the current user.
     *
     * @param {Request} req - Request with the current auth session.
     * @param {number} quoteId - ID of the quote to update.
     * @param {UpdateQuoteDto} updateQuoteDto - Updated quote data.
     * @returns {Promise<Quote>} - Resulting updated quote.
     */
    @Patch('myquote/:id')
    async updateOwnQuote(
        @Request() req,
        @Param('id') quoteId: number,
        @Body() updateQuoteDto: UpdateQuoteDto,
    ): Promise<Quote> {
        const quote: Quote = await this.quoteService.findOne(quoteId);
        if (!quote)
            throw new NotFoundException('Invalid quote ID');

        if (quote.user.id !== req.user.id)
            throw new UnauthorizedException('You are not authorized to update this quote');

        return await this.quoteService.update(quote.id, updateQuoteDto);
    }

}