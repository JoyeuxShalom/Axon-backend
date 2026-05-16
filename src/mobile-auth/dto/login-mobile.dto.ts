import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginMobileDto {
  @ApiProperty({ example: 'patient@axon.com', description: 'The patient email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!', description: 'Minimum 6 characters' })
  @IsString()
  @MinLength(6)
  password: string;
}
