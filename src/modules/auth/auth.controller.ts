import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpCode,
    HttpStatus, Param,
    Post,
    Req,
    Request,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegistrationDto } from './dto/registration.dto';
import { TokenPayload } from '../../interfaces/auth.interface';
import { User } from '../../entities/user.entity';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Request() req) {
        return req.user;
    }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() registrationDto: RegistrationDto): Promise<User> {
        const user = await this.authService.register(registrationDto);
        if (!user) throw new UnauthorizedException();
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@Req() req) {
        return this.authService.logout(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.ACCEPTED)
    async refreshAccessToken(
        @Req() req,
        @Param('refresh_token') refreshToken: string
    ): Promise<TokenPayload> {
        return this.authService.refreshAccessToken(req.user.id, refreshToken);
    }

}
