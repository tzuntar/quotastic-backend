import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuoteDto {
    @IsNotEmpty()
    @IsString()
    body: string;

    @IsString()
    userId: string;
}
