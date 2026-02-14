import {
    Get,
    Put,
    Body,
    Post,
    Param,
    Delete,
    UseGuards,
    Controller,
    ParseIntPipe,
    UploadedFile,
    ParseFilePipe,
    UseInterceptors,
    FileTypeValidator,
    MaxFileSizeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { CriarUserDto, AtualizarUserDto, UserLoginDto, UserMailDto } from './user.dto/user.dto';

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
    async list() {
        return this.userService.listUsers();
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @Get(':email')
    async findUserMail(@Param('email') email: string) {
        return this.userService.findUserByEmail(email);
    }

    @Put()
    async update(@Body() userDto: AtualizarUserDto) {
        return this.userService.updateUser(userDto);
    }

    @Public()
    @Put('redefine-password')
    async redefinePassword(@Body() userDto: UserMailDto) {
        return this.userService.redefinePassword(userDto);
    }   

    @Post('upload-foto')
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
        if(!data.id)
            return { message: 'O ID do usuário é obrigatório' };

        data.id = Number(data.id);

        // Converte o arquivo para base64
        const base64       = file.buffer.toString('base64');
        const mimeType     = file.mimetype;
        const profileImage = `data:${mimeType};base64,${base64}`;
        
        return this.userService.updateUser({
            id:         data.id,
            profileImage: profileImage
        });
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }
}
