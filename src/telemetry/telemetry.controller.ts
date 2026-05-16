import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';
import { IngestTelemetryDto } from './dto/ingest-telemetry.dto';
import { ResolveAlertDto } from './dto/resolve-alert.dto';

@ApiTags('Telemetry & Alerts')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  // ─── FRONTEND API: Get History (Protected) ─────────────────
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('history/:patientId')
  @ApiOperation({ summary: 'Get telemetry history for a patient (for charts)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records to return' })
  getHistory(@Param('patientId') patientId: string, @Query('limit') limit?: string) {
    const queryLimit = limit ? parseInt(limit, 10) : 20;
    return this.telemetryService.getPatientHistory(patientId, queryLimit);
  }

  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('latest/:patientId')
  @ApiOperation({ summary: 'Get the absolute latest telemetry record for a patient' })
  getLatest(@Param('patientId') patientId: string) {
    return this.telemetryService.getLatestTelemetry(patientId);
  }

  // ─── HARDWARE API: Ingest Data from ESP32 ──────────────────
  @Post('ingest')
  @ApiOperation({ summary: 'Ingest sensor data from ESP32 hardware device' })
  @ApiResponse({ status: 201, description: 'Data processed and stored.' })
  async ingestDeviceData(@Body() data: IngestTelemetryDto) {
    return this.telemetryService.processDeviceData(data);
  }

  // ─── ALERTS: Get filtered list for a patient ───────────────
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('alerts/:patientId')
  @ApiOperation({ summary: 'Get alerts for a patient with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['UNRESOLVED', 'RESOLVED', 'STABLE'], description: 'Filter by alert status' })
  @ApiQuery({ name: 'severity', required: false, enum: ['low', 'medium', 'critical'], description: 'Filter by severity level' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max number of alerts to return' })
  getAlerts(
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('limit') limit?: string,
  ) {
    return this.telemetryService.getAlertsByPatient(patientId, {
      status,
      severity,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // ─── ALERTS: Get single alert detail ───────────────────────
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('alerts/detail/:alertId')
  @ApiOperation({ summary: 'Get a single alert with full details' })
  @ApiResponse({ status: 200, description: 'Returns the alert details.' })
  @ApiResponse({ status: 404, description: 'Alert not found.' })
  getAlertDetail(@Param('alertId') alertId: string) {
    return this.telemetryService.getAlertDetail(alertId);
  }

  // ─── ALERTS: Resolve an alert ──────────────────────────────
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Patch('alerts/:alertId/resolve')
  @ApiOperation({ summary: 'Mark an alert as resolved' })
  @ApiResponse({ status: 200, description: 'Alert resolved successfully.' })
  @ApiResponse({ status: 404, description: 'Alert not found.' })
  resolveAlert(@Param('alertId') alertId: string, @Body() dto: ResolveAlertDto) {
    return this.telemetryService.resolveAlert(alertId, dto.resolvedNote);
  }
}