import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class CurrentUserController {
    constructor(private userService: UserService) {}

    @Get()
    async getCurrentUser(@Request() req): Promise<User> {
        const user: User = await this.userService.getById(req.id);
        const { password, ...userWithoutPass } = user;
        return userWithoutPass;
    }

}