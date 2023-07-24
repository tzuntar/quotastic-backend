import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegistrationDto } from './dto/registration.dto';
import { PasswordUpdateDto } from './dto/password-update.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async login(loginDto: LoginDto) {
        const user: User = await this.userService.findByEmail(loginDto.email);
        if (!user) throw new NotFoundException('User does not exists');
        if (!(await bcrypt.compare(loginDto.password, user.password)))
            throw new BadRequestException('Password mismatch');
        return this.signJwt(user);
    }

    async register(registrationDto: RegistrationDto) {
        const user: User = await this.userService.create({ ...registrationDto });
        if (!user) throw new BadRequestException('Invalid registration data');
        return this.signJwt(user);
    }

    async refreshAccessToken(userId: string, refreshToken: string) {
        const user: User = await this.userService.findById(userId);
        if (!user) throw new BadRequestException('User does not exist');
        const verified = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        if (!verified) throw new UnauthorizedException('Invalid refresh token');
        return this.signJwt(user);
    }

    async updatePassword(userId: string, passwordUpdateDto: PasswordUpdateDto) {
        const user: User = await this.userService.findById(userId);
        if (!user) throw new NotFoundException('User does not exist');
        if (
            !(await bcrypt.compare(passwordUpdateDto.currentPassword, user.password))
        )
            throw new BadRequestException('Password mismatch');
        const newUser: User = await this.userService.update(userId, {
            password: passwordUpdateDto.newPassword,
        });
        if (!newUser)
            throw new InternalServerErrorException('Updating password failed');
        return newUser;
    }

    async logout(userId: string) {
        const user = await this.userService.findById(userId);
        if (!user) throw new BadRequestException('User does not exist');
        await this.userService.update(user.id, {refreshToken: null});
    }

    /**
     * Convenience method for serializing and signing a JWT.
     * Note that this function does no login validation whatsoever.
     * @param {User} user - User to sign the JWT for.
     * @returns {Promise<any>} - Signed token with serialized user data.
     * @private
     */
    private async signJwt(user: User): Promise<any> {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
