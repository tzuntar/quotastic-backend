import {BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import {LoginDto} from './dto/login.dto';
import {UserService} from '../user/user.service';
import * as bcrypt from 'bcrypt';
import {User} from '../user/entity/user.entity';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validate(loginDto: LoginDto) {
        const user: User = await this.userService.getByEmail(loginDto.email);
        if (!user)
            throw new NotFoundException('User does not exists');
        if (!(await bcrypt.compare(loginDto.password, user.password)))
            throw new BadRequestException('Password mismatch');
        const payload = {email: user.email, sub: user.id};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
