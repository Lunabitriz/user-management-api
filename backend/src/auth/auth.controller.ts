import { 
  Body,
  Post, 
  Controller, 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from '../user/user.dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }
}