import { Controller, Get, Post, Body, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  // 1. FRONTEND API: Get History (Protected by Guard)
  @UseGuards(FirebaseAuthGuard)
  @Get('history/:patientId')
  getHistory(@Param('patientId') patientId: string, @Query('limit') limit?: string) {
    const queryLimit = limit ? parseInt(limit, 10) : 20;
    return this.telemetryService.getPatientHistory(patientId, queryLimit);
  }

  // 2. HARDWARE API: Ingest Data from ESP32
  // Notice: No AuthGuard here for now! ESP32 uses a lightweight API key, not a user JWT.
  @Post('ingest')
  async ingestDeviceData(@Body() data: IngestTelemetryDto) {
    // We will build this logic in the service next
    return this.telemetryService.processDeviceData(data);
  }
}