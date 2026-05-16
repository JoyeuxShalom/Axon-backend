import { Controller, Post, Get, Patch, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MobileAuthService } from './mobile-auth.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';
import { LoginMobileDto } from './dto/login-mobile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Mobile App Authentication')
@Controller('mobile/auth')
export class MobileAuthController {
  constructor(private readonly mobileAuthService: MobileAuthService) {}

  // ─── PUBLIC ENDPOINTS ──────────────────────────────────────

  @Post('register')
  @ApiOperation({ summary: 'Register a new patient from the mobile app' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., email already exists).' })
  register(@Body() dto: RegisterMobilePatientDto) {
    console.log('--- MOBILE REGISTRATION ATTEMPT ---');
    console.log('Email:', dto.email);
    return this.mobileAuthService.registerPatient(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a patient and receive a custom token + profile' })
  @ApiResponse({ status: 200, description: 'Login successful. Returns customToken and profile.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() dto: LoginMobileDto) {
    console.log('--- MOBILE LOGIN ATTEMPT ---');
    console.log('Email:', dto.email);
    return this.mobileAuthService.loginPatient(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send a password reset email to the patient' })
  @ApiResponse({ status: 200, description: 'Reset email sent (if account exists).' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.mobileAuthService.forgotPassword(dto.email);
  }

  // ─── PROTECTED ENDPOINTS ───────────────────────────────────

  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get the authenticated patient profile' })
  @ApiResponse({ status: 200, description: 'Returns the patient profile from Firestore.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  getProfile(@Req() req: any) {
    return this.mobileAuthService.getProfile(req.user.uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'Update the authenticated patient profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.mobileAuthService.updateProfile(req.user.uid, dto);
  }
}