import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CriarUserDto, AtualizarUserDto, UserLoginDto } from './user.dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(userDto: CriarUserDto) {
        const newUser = await this.prisma.user.create({
            data: {
                nome: userDto.nome,
                email: userDto.email,
                senha: userDto.senha,
                fotoPerfil: userDto.fotoPerfil || null,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                fotoPerfil: true,
            }
        });

        return {
            message: 'Usuário criado com sucesso!', 
            newUser
        };
    }

    async loginUser(loginUser: UserLoginDto) {
        const userFind = await this.prisma.user.findUnique({
            where: {
                email: loginUser.email
            },
            select: {
                id: true,
                nome: true,
                email: true,
                senha: true,
                fotoPerfil: true,
            }
        });

        if(!userFind) {
            throw new UnauthorizedException('Email ou senha incorretos.');
        }
        
        if(userFind.senha !== loginUser.senha) {
            throw new UnauthorizedException('Senha incorreta.');
        }

        return {
            message: 'Usuário acessado com sucesso!',
            userFind
        }
    }

    async listUsers() {
        const userList = await this.prisma.user.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                fotoPerfil: true,
            }
        });

        if(!userList.length) {
            throw new NotFoundException('Não há usuários cadastrados no sistema!');
        }

        return userList;
    }

    async updateUser(userDto: AtualizarUserDto) {
        const currentUser = await this.prisma.user.findUnique({
            where: {
                id: userDto.id,
            }
        });

        if(!currentUser) {
            throw new NotFoundException('Usuário não encontrado!');
        }

        const updateUser = await this.prisma.user.update({
            where: {
                id: userDto.id
            },
            data: {
                nome: userDto.nome ?? currentUser.nome,
                email: userDto.email ?? currentUser.email,
                senha: userDto.senha ?? currentUser.senha,
                fotoPerfil: userDto.fotoPerfil ?? currentUser.fotoPerfil,
            },
            select: {
                nome: true,
                email: true,
                senha: true,
                fotoPerfil: true,
            }
        });

        return {
            message: 'Usuário atualizado com sucesso!',
            updateUser,
        }
    }

    async deleteUser(id: number) {
        const userFind = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(!userFind) {
            throw new NotFoundException('Usuário não encontrado!');
        }

        await this.prisma.user.delete({
            where: {
                id: id
            }
        });

        return 'Usuário deletado com sucesso!';
    }
}
