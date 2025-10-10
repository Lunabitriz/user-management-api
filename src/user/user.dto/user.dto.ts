import { IsString, IsNumber, IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";

export class CriarUserDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minUppercase: 1,
        minLowercase: 0,
        minSymbols: 1
    })
    senha: string;

    @IsString()
    @IsOptional()
    fotoPerfil?: string;
}

export class UserLoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    senha: string;
}

export class UserMailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    code?: string;

    @IsOptional()
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minUppercase: 1,
        minLowercase: 0,
        minSymbols: 1
    })
    senha?: string;
}

export class AtualizarUserDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    nome?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
    
    @IsOptional()
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minUppercase: 1,
        minLowercase: 0,
        minSymbols: 1
    })
    senha?: string;

    @IsString()
    @IsOptional()
    fotoPerfil?: string;
}