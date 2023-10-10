import {IsNotEmpty, IsNumber} from "class-validator";

export class ScoreDataDto {
    @IsNotEmpty()
    @IsNumber()
    quotesCount: number;
    @IsNotEmpty()
    @IsNumber()
    karma: number;
}
