import { IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    firstName?: string;

    @IsOptional()
    lastName?: string;

    @IsOptional()
    password?: string;

    @IsOptional()
    refreshToken?: string;

    @IsOptional()
    avatarUrl?: string;
}
