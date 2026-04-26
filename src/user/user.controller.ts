import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDoctorDto } from './dto/register.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /users/register
  // Note: We use the Guard to ensure they are logged into Firebase Auth first
  @UseGuards(FirebaseAuthGuard)
  @Post('register-doctor')
  async register(@Body() registerDto: RegisterDoctorDto, @Req() request: any) {
    // request.user.uid comes from the FirebaseAuthGuard
    return this.userService.registerDoctor(registerDto, request.user.uid);
  }

  // GET /users/profile
  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  async getProfile(@Req() request: any) {
    return this.userService.getDoctorProfile(request.user.uid);
  }
}