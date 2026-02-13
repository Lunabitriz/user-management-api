import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserLoginDto } from '../user/user.dto/user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService:  JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    
    if(!user)
      throw new UnauthorizedException('Email ou senha incorretos.');
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
      throw new UnauthorizedException('Email ou senha incorretos.');

    const { password:_, ...result } = user;
    return result;
  }

  async login(loginUser: UserLoginDto) {
    const user = await this.validateUser(loginUser.email, loginUser.password);
    
    const payload = { 
      sub:   user.id,
      name:  user.name,
      email: user.email, 
    };

    return {
      user: {
        id:           user.id,
        name:         user.name,
        email:        user.email,
        profileImage: user.profileImage,
      },
      access_token: this.jwtService.sign(payload)
    };
  }

  async validateToken(payload: any) {
    const user = await this.userService.findUserByEmail(payload.email);
    
    if(!user)
      throw new UnauthorizedException('Token inválido.');

    const { password:_, ...result } = user;
    return result;
  }
}