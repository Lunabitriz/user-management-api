import { Body, Controller, Post, Get, Put, Delete, Param, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { CriarUserDto, AtualizarUserDto, UserLoginDto } from './user.dto/user.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() userDto: CriarUserDto) {
        return this.userService.createUser(userDto);
    }

    @Post('login')
    async login(@Body() loginDto: UserLoginDto) {
        return this.userService.loginUser(loginDto);
    }

    @Get() 
    @UseGuards(JwtAuthGuard)
    async list() {
        return this.userService.listUsers();
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async update(@Body() userDto: AtualizarUserDto) {
        return this.userService.updateUser(userDto);
    }

    @Post('upload-foto')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('foto'))
    async uploadProfilePhoto(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body() data: { id: number }
    ) {
        // Valida se o ID foi fornecido
        if (!data.id) {
            throw new Error('ID do usuário é obrigatório');
        }

        data.id = Number(data.id);

        // Converte o arquivo para base64
        const base64 = file.buffer.toString('base64');
        const mimeType = file.mimetype;
        const fotoPerfil = `data:${mimeType};base64,${base64}`;
        
        return this.userService.updateUser({
            id: data.id,
            fotoPerfil: fotoPerfil
        });
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }
}
