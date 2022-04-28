import { IsEmail, IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}