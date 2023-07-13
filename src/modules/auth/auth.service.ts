import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegistrationDto } from './dto/registration.dto';
import { PasswordUpdateDto } from './dto/password-update.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validate(loginDto: LoginDto) {
        const user: User = await this.userService.getByEmail(loginDto.email);
        if (!user) throw new NotFoundException('User does not exists');
        if (!(await bcrypt.compare(loginDto.password, user.password)))
            throw new BadRequestException('Password mismatch');
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async register(registrationDto: RegistrationDto) {
        const user: User = await this.userService.addUser({ ...registrationDto });
        if (!user) throw new BadRequestException('Invalid registration data');
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async updatePassword(userId: number, passwordUpdateDto: PasswordUpdateDto) {
        const user: User = await this.userService.getById(userId);
        if (!user) throw new NotFoundException('User does not exist');
        if (
            !(await bcrypt.compare(passwordUpdateDto.currentPassword, user.password))
        )
            throw new BadRequestException('Password mismatch');
        const newUser: User = await this.userService.userUpdate(userId, {
            password: passwordUpdateDto.newPassword,
        });
        if (!newUser)
            throw new InternalServerErrorException('Updating password failed');
        return newUser;
    }
}
