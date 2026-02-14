import { 
    Injectable, 
    NotFoundException, 
    BadRequestException, 
    UnauthorizedException, 
    NotAcceptableException, 
} from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
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
        name:         true,
        email:        true,
        profileImage: true,
        accountTheme: true,
    }

    private readonly userInternalSelect = {
        id:           true,
        name:         true,
        email:        true,
        password:     true,
        profileImage: true,
        accountTheme: true,
    } 
    
    async createUser(userDto: CriarUserDto) {
        const userExists = await this.findUserByEmail(userDto.email);
        if(userExists) {
            throw new UnauthorizedException('User already registered in the system.');
        }

        const passwordHashed = await bcrypt.hash(userDto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                password:     passwordHashed,
                name:         userDto.name,
                email:        userDto.email,
                profileImage: userDto.profileImage || null,
                accountTheme: userDto.accountTheme || 'sunset',
            },
            select: this.userSelect
        });

        return {
            message: 'User created successfully!', 
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
            throw new UnauthorizedException('Incorrect email or password.');

        const isMatch = await bcrypt.compare(loginUser.password, userFind.password);
        
        if(!isMatch)
            throw new UnauthorizedException('Incorrect password.');

        return {
            message: 'User logged in successfully!',
            userFind
        }
    }
    
    async listUsers() {
        const userList = await this.prisma.user.findMany({
            select: this.userSelect
        });

        if(!userList || userList.length === 0)
            throw new NotFoundException('No users registered in the system!');

        return userList;
    }

    async getUserById(id: number) {
        const userFind = await this.prisma.user.findUnique({
            where: { id: id }
        });

        if(!userFind)
            throw new NotFoundException('User not found!');

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
            throw new NotFoundException('User not found!');

        const updateUser = await this.prisma.user.update({
            where: {
                id: userDto.id
            },
            data: {
                name:         userDto.name         ?? currentUser.name,
                email:        userDto.email        ?? currentUser.email,
                password:     userDto.password     ?? currentUser.password,
                profileImage: userDto.profileImage ?? currentUser.profileImage,
                accountTheme: userDto.accountTheme ?? currentUser.accountTheme,
            },
            select: this.userSelect
        });

        return {
            message: 'User updated successfully!',
            updateUser,
        }
    }

    async forgotPassword(userDto: UserMailDto) {
        const userFind = await this.findUserByEmail(userDto.email.trim());

        if(!userFind)
            throw new NotFoundException('User not found.');
            
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
            message: 'Password reset email sent successfully!'
        };
    }

    async validateReceivedCode(userMail: UserMailDto) {
        const userFind = await this.prisma.user.findUnique({
            where: { email: userMail.email }
        });

        if(!userFind)
            throw new NotFoundException('User not found.');

        const requestFind = await this.prisma.passwordReset.findFirst({
            where: {
                userId: userFind.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if(!requestFind)
            throw new BadRequestException('Invalid or expired code!');

        const isValid = await bcrypt.compare(userMail.code || '', requestFind.codeHash);

        if(!isValid || requestFind.expiresAt < new Date())
            throw new BadRequestException('Invalid or expired code!') 

        return { message: 'Code validated successfully!' };
    }

    async redefinePassword(userDto: UserMailDto) {
        const userFind = await this.findUserByEmail(userDto.email);

        if(!userFind)
            throw new NotFoundException('User not found!');

        if(!userDto.password)
            throw new NotAcceptableException('Please provide a valid password to update.');

        const password = await bcrypt.hash(userDto.password, 10);

        await this.prisma.user.update({
            where: { email: userFind.email },
            data:  { password: password    }
        });

        return { message: 'Password redefined successfully!' };
    }

    async deleteUser(id: number) {
        const userFind = await this.prisma.user.findUnique({
            where: { id: id }
        });

        if(!userFind)
            throw new NotFoundException('User not found!');

        await this.prisma.user.delete({
            where: { id: id }
        });

        return 'User deleted successfully!';
    }
}