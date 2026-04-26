import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patients')
@UseGuards(FirebaseAuthGuard) // Protects all patient routes
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.getPatientById(id);
  }

  @Get('ward/:wardName')
  findByWard(@Param('wardName') wardName: string) {
    return this.patientService.getPatientsByWard(wardName);
  }

  @Patch(':id/device')
  assignDevice(@Param('id') id: string, @Body('deviceId') deviceId: string) {
    return this.patientService.assignDevice(id, deviceId);
  }
}