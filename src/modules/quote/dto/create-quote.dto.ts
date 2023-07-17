import { IsNotEmpty } from 'class-validator';

export class CreateQuoteDto {
    @IsNotEmpty()
    body: string;
}
