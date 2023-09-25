import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuoteDto {
    @IsNotEmpty()
    @IsString()
    body: string;

    userId: string;
}
