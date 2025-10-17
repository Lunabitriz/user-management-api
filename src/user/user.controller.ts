import {
    Body,
    Post,
    Get,
    Put,
    Param,
    Delete,
    Controller,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UseGuards,
} from '@nestjs/common';
import { CriarUserDto, AtualizarUserDto, UserLoginDto, UserMailDto } from './user.dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

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

    @Post('forgot-password')
    async forgotPassword(@Body() userMailDto: UserMailDto) {
        return this.userService.forgotPassword(userMailDto);
    }

    @Post('verify-send-code')
    async validateReceivedCode(@Body() userMailDto: UserMailDto) {
        return this.userService.validateReceivedCode(userMailDto);
    }

    @Get() 
    @UseGuards(JwtAuthGuard)
    async list() {
        return this.userService.listUsers();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUser(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @Get(':email')
    async findUserMail(@Param('email') email: string) {
        return this.userService.findUserByEmail(email);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async update(@Body() userDto: AtualizarUserDto) {
        return this.userService.updateUser(userDto);
    }

    @Put('redefine-password')
    // @UseGuards(JwtAuthGuard)
    async redefinePassword(@Body() userDto: UserMailDto) {
        return this.userService.redefinePassword(userDto);
    }   

    @Post('upload-foto')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('foto'))
    async uploadProfilePhoto(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body() data: { id: number }
    ) {
        if(!data.id) {
            throw new Error('O ID do usuário é obrigatório');
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
