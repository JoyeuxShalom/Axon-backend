import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MobileAuthService } from './mobile-auth.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';

@ApiTags('Mobile App Authentication') // Groups it nicely in Swagger
@Controller('mobile/auth')
export class MobileAuthController {
  constructor(private readonly mobileAuthService: MobileAuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new patient from the mobile app' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., email already exists).' })
  register(@Body() dto: RegisterMobilePatientDto) {
    return this.mobileAuthService.registerPatient(dto);
  }
}