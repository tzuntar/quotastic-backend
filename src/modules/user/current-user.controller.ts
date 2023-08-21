import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { PasswordUpdateDto } from '../auth/dto/password-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthService } from '../auth/auth.service';
import { LocalFilestore } from '../../helpers/local.filestore';

@UseGuards(JwtAuthGuard)
@Controller('me')
@UseInterceptors(ClassSerializerInterceptor)
export class CurrentUserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getCurrentUser(@Request() req): Promise<User> {
        return this.userService.findById(req.id);
    }

    @Patch('update-password')
    @HttpCode(HttpStatus.OK)
    async updatePassword(
        @Request() req,
        @Body() passwordUpdateDto: PasswordUpdateDto,
    ): Promise<User> {
        return this.authService.updatePassword(
            req.id,
            passwordUpdateDto,
        );
    }

    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar', LocalFilestore.storeImageFile))
    @HttpCode(HttpStatus.CREATED)
    async uploadAvatar(
        @Request() req,
        @UploadedFile() avatar: Express.Multer.File,
    ): Promise<User> {
        // Disabled due to ESM interop problems
        /*if (!await LocalFilestore.verifyImageFile(avatar.path)) {
            LocalFilestore.unlink(avatar.path);
            throw new BadRequestException('Invalid file type, must be either JPG/JPEG or PNG.');
        }*/
        return this.userService.update(req.user.id, { avatarUrl: avatar.path });
    }

}