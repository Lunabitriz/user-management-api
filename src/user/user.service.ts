import { 
    Injectable, 
    NotFoundException, 
    BadRequestException, 
    UnauthorizedException, 
    NotAcceptableException, 
} from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CriarUserDto, AtualizarUserDto, UserLoginDto, UserMailDto } from './user.dto/user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService, 
        private readonly mailerService: MailerService
    ) {}

    private readonly userSelect = {
        id:           true,
        nome:         true,
        email:        true,
        fotoPerfil:   true,
        accountTheme: true,
    }

    private readonly userInternalSelect = {
        id:           true,
        nome:         true,
        email:        true,
        senha:        true,
        fotoPerfil:   true,
        accountTheme: true,
    } 
    
    async createUser(userDto: CriarUserDto) {
        const userExists = await this.findUserByEmail(userDto.email);
        if(userExists) {
            throw new UnauthorizedException('Usuário já cadastrado no sistema.');
        }

        const password = await bcrypt.hash(userDto.senha, 10);

        const newUser = await this.prisma.user.create({
            data: {
                senha:        password,
                nome:         userDto.nome,
                email:        userDto.email,
                fotoPerfil:   userDto.fotoPerfil   || null,
                accountTheme: userDto.accountTheme || 'sunset',
            },
            select: this.userSelect
        });

        return {
            message: 'Usuário criado com sucesso!', 
            newUser
        };
    }

    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email
            },
            select: this.userInternalSelect
        });
    }

    async loginUser(loginUser: UserLoginDto) {
        const userFind = await this.prisma.user.findUnique({
            where: {
                email: loginUser.email
            },
            select: this.userInternalSelect
        });

        if(!userFind)
            throw new UnauthorizedException('Email ou senha incorretos.');

        const isMatch = await bcrypt.compare(loginUser.senha, userFind.senha);
        
        if(!isMatch)
            throw new UnauthorizedException('Senha incorreta.');

        return {
            message: 'Usuário acessado com sucesso!',
            userFind
        }
    }
    
    async listUsers() {
        const userList = await this.prisma.user.findMany({
            select: this.userSelect
        });

        if(!userList || userList.length === 0)
            throw new NotFoundException('Não há usuários cadastrados no sistema!');

        return userList;
    }

    async getUserById(id: number) {
        const userFind = await this.prisma.user.findUnique({
            where: { id: id }
        });

        if(!userFind)
            throw new NotFoundException('Usuário não encontrado!');

        return await this.prisma.user.findUnique({
            where:  { id: id },
            select: this.userSelect
        });
    }

    async updateUser(userDto: AtualizarUserDto) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userDto.id }
        });

        if(!currentUser)
            throw new NotFoundException('Usuário não encontrado!');

        const updateUser = await this.prisma.user.update({
            where: {
                id: userDto.id
            },
            data: {
                nome:         userDto.nome         ?? currentUser.nome,
                email:        userDto.email        ?? currentUser.email,
                senha:        userDto.senha        ?? currentUser.senha,
                fotoPerfil:   userDto.fotoPerfil   ?? currentUser.fotoPerfil,
                accountTheme: userDto.accountTheme ?? currentUser.accountTheme,
            },
            select: this.userSelect
        });

        return {
            message: 'Usuário atualizado com sucesso!',
            updateUser,
        }
    }

    async forgotPassword(userDto: UserMailDto) {
        const userFind = await this.findUserByEmail(userDto.email.trim());

        if(!userFind)
            throw new NotFoundException('Usuário não encontrado.');
            
        const code = await this.mailerService.generateAndSendCode(userDto.email);

        const codeHash  = await bcrypt.hash(code, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.prisma.passwordReset.create({
            data: {
                userId:    userFind.id,
                codeHash:  codeHash,
                expiresAt: expiresAt
            }
        })

        return { 
            message: 'E-mail de redefinição enviado com sucesso!'
        };
    }

    async validateReceivedCode(userMail: UserMailDto) {
        const userFind = await this.prisma.user.findUnique({
            where: { email: userMail.email }
        });

        if(!userFind)
            throw new NotFoundException('Usuário não encontrado.');

        const requestFind = await this.prisma.passwordReset.findFirst({
            where: {
                userId: userFind.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if(!requestFind)
            throw new BadRequestException('Código inválido ou expirado!');

        const isValid = await bcrypt.compare(userMail.code || '', requestFind.codeHash);

        if(!isValid || requestFind.expiresAt < new Date())
            throw new BadRequestException('Código inválido ou expirado!') 

        return { message: 'Código validado com sucesso!' };
    }

    async redefinePassword(userDto: UserMailDto) {
        const userFind = await this.findUserByEmail(userDto.email);

        if(!userFind)
            throw new NotFoundException('Usuário não encontrado!');

        if(!userDto.senha)
            throw new NotAcceptableException('Informe uma senha válida para atualizar.');

        const password = await bcrypt.hash(userDto.senha, 10);

        await this.prisma.user.update({
            where: { email: userFind.email },
            data:  { senha: password       }
        });

        return { message: 'Senha redefinida com sucesso!' };
    }

    async deleteUser(id: number) {
        const userFind = await this.prisma.user.findUnique({
            where: { id: id }
        });

        if(!userFind)
            throw new NotFoundException('Usuário não encontrado!');

        await this.prisma.user.delete({
            where: { id: id }
        });

        return 'Usuário deletado com sucesso!';
    }
}