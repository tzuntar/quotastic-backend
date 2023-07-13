import { IsNotEmpty, MinLength } from 'class-validator';

export class PasswordUpdateDto {
    @IsNotEmpty()
    @MinLength(8)
    currentPassword: string;

    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}
