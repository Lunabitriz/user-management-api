import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserLoginDto } from '../user/user.dto/user.dto';

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
      return { message: 'Incorrect email or password.', data: null };
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
      return { message: 'Incorrect email or password.', data: null };

    const { password:_, ...result } = user;
    return { message: 'User validated successfully!', data: result };
  }

  async login(loginUser: UserLoginDto) {
    const validation = await this.validateUser(loginUser.email, loginUser.password);

    if(!validation.data)
      return validation;

    const user = validation.data;

    const payload = { 
      sub:   user.id,
      name:  user.name,
      email: user.email, 
    };

    return {
      message: 'User logged in successfully!',
      data: {
        user: {
          id:           user.id,
          name:         user.name,
          email:        user.email,
          profileImage: user.profileImage,
        },
        access_token: this.jwtService.sign(payload)
      }
    };
  }

  async validateToken(payload: any) {
    const user = await this.userService.findUserByEmail(payload.email);
    
    if(!user)
      return { message: 'Invalid token.', data: null };

    const { password:_, ...result } = user;
    return { message: 'Token validated successfully!', data: result };
  }
}