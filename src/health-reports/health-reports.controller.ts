import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HealthReportsService } from './health-reports.service';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Health Reports')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('mobile/health-reports')
export class HealthReportsController {
  constructor(private readonly reportsService: HealthReportsService) {}

  @Get(':patientId/summary')
  @ApiOperation({ summary: 'Get aggregated health report summary for a patient' })
  @ApiQuery({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Returns aggregated vitals summary (avg, peak, min for HR, BP, SpO2).' })
  getSummary(
    @Param('patientId') patientId: string,
    @Query('period') period: string,
    @Query('date') date: string,
  ) {
    return this.reportsService.getSummary(patientId, period, date);
  }

  @Get(':patientId/export')
  @ApiOperation({ summary: 'Export health report data for client-side PDF/CSV rendering' })
  @ApiQuery({ name: 'format', required: false, enum: ['json', 'csv'], description: 'Export format (default: json)' })
  @ApiQuery({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Returns formatted data for export.' })
  getExportData(
    @Param('patientId') patientId: string,
    @Query('format') format?: string,
    @Query('period') period?: string,
    @Query('date') date?: string,
  ) {
    return this.reportsService.getExportData(
      patientId,
      period || 'daily',
      date || new Date().toISOString().split('T')[0],
      format || 'json',
    );
  }

  @Get(':patientId/trend')
  @ApiOperation({ summary: 'Get time-series trend data for charting (daily=hourly, weekly=daily, monthly=weekly buckets)' })
  @ApiQuery({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'metric', required: false, enum: ['heartRate', 'bloodPressure', 'spo2', 'all'], description: 'Metric to return (default: all)' })
  @ApiResponse({ status: 200, description: 'Returns time-bucketed data points for chart rendering.' })
  getTrend(
    @Param('patientId') patientId: string,
    @Query('period') period: string,
    @Query('date') date: string,
    @Query('metric') metric?: string,
  ) {
    return this.reportsService.getTrend(patientId, period, date, metric || 'all');
  }

  @Get(':patientId/compare')
  @ApiOperation({ summary: 'Compare current period stats vs previous period (e.g., this week vs last week)' })
  @ApiQuery({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'], description: 'Report period' })
  @ApiQuery({ name: 'date', required: true, type: String, description: 'Reference date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Returns current summary, previous summary, and percentage changes.' })
  getComparison(
    @Param('patientId') patientId: string,
    @Query('period') period: string,
    @Query('date') date: string,
  ) {
    return this.reportsService.getComparison(patientId, period, date);
  }
}
