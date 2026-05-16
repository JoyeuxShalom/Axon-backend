import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateDeviceSettingsDto } from './dto/update-device-settings.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Patient Management')
@Controller('patients')
@UseGuards(FirebaseAuthGuard) // Protects all patient routes
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient record' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully.' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Returns the patient record.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  findOne(@Param('id') id: string) {
    return this.patientService.getPatientById(id);
  }

  @Get('ward/:wardName')
  @ApiOperation({ summary: 'Get all patients in a specific ward' })
  @ApiResponse({ status: 200, description: 'Returns list of patients in the ward.' })
  findByWard(@Param('wardName') wardName: string) {
    return this.patientService.getPatientsByWard(wardName);
  }

  @Patch(':id/device')
  @ApiOperation({ summary: 'Assign an IoT device to a patient' })
  @ApiResponse({ status: 200, description: 'Device assigned successfully.' })
  assignDevice(@Param('id') id: string, @Body('deviceId') deviceId: string) {
    return this.patientService.assignDevice(id, deviceId);
  }

  // ─── DEVICE INFO ───────────────────────────────────────────

  @Get(':id/device')
  @ApiOperation({ summary: 'Get device info and settings for a patient' })
  @ApiResponse({ status: 200, description: 'Returns device status, battery, and tracking settings.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  getDeviceInfo(@Param('id') id: string) {
    return this.patientService.getDeviceInfo(id);
  }

  @Patch(':id/device/settings')
  @ApiOperation({ summary: 'Update device tracking settings for a patient' })
  @ApiResponse({ status: 200, description: 'Device settings updated successfully.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  updateDeviceSettings(@Param('id') id: string, @Body() dto: UpdateDeviceSettingsDto) {
    return this.patientService.updateDeviceSettings(id, dto);
  }
}