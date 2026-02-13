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

  async validateUser(email: string, senha: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    
    if(!user)
      throw new UnauthorizedException('Email ou senha incorretos.');
    
    const isMatch = await bcrypt.compare(senha, user.senha);

    if(!isMatch)
      throw new UnauthorizedException('Email ou senha incorretos.');

    const { senha: password, ...result } = user;
    return result;
  }

  async login(loginUser: UserLoginDto) {
    const user = await this.validateUser(loginUser.email, loginUser.senha);
    
    const payload = { 
      sub:   user.id,
      nome:  user.nome,
      email: user.email, 
    };

    return {
      user: {
        id:         user.id,
        nome:       user.nome,
        email:      user.email,
        fotoPerfil: user.fotoPerfil,
      },
      access_token: this.jwtService.sign(payload)
    };
  }

  async validateToken(payload: any) {
    const user = await this.userService.findUserByEmail(payload.email);
    
    if(!user)
      throw new UnauthorizedException('Token inválido.');

    const { senha: password, ...result } = user;
    return result;
  }
}