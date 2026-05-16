import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'patient@axon.com', description: 'The email address to send reset link to' })
  @IsEmail()
  email: string;
}
