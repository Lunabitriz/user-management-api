import { 
    IsEmail,
    IsNumber,
    IsString,
    IsNotEmpty,
    IsOptional,
    IsStrongPassword,
} from "class-validator";

export class CriarUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    @IsStrongPassword({
        minLength:    8,
        minNumbers:   1,
        minUppercase: 1,
        minLowercase: 0,
        minSymbols:   1
    })
    password: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    accountTheme?: string;
}

export class UserLoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
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
        minLength:    8,
        minNumbers:   1,
        minUppercase: 1,
        minLowercase: 0,
        minSymbols:   1
    })
    password?: string;
}

export class AtualizarUserDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
    
    @IsOptional()
    @IsStrongPassword({
        minLength:    8,
        minNumbers:   1,
        minUppercase: 1,
        minLowercase: 0,
        minSymbols:   1
    })
    password?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    accountTheme?: string;
}