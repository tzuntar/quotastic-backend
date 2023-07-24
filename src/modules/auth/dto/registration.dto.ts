import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../../../annotations/match.decorator';

export class RegistrationDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match' })
    passwordConfirmation: string;
}
