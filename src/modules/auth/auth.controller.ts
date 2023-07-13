import { Body, Controller, Get, Patch, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegistrationDto } from './dto/registration.dto';
import { PasswordUpdateDto } from './dto/password-update.dto';
import { User } from '../user/entity/user.entity';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return req.user;
    }

    @Post('signup')
    async signup(@Body() registrationDto: RegistrationDto) {
        const user = await this.authService.register(registrationDto);
        if (!user) throw new UnauthorizedException();
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('session')
    profile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/me/update-password')
    async updatePassword(
        @Request() req,
        @Body() passwordUpdateDto: PasswordUpdateDto,
    ): Promise<User> {
        const newUser: User = await this.authService.updatePassword(
            req.id,
            passwordUpdateDto,
        );
        const { password, ...userWithoutPass } = newUser;
        return userWithoutPass;
    }
}
