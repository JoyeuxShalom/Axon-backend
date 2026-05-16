import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HospitalTrackerService } from './hospital-tracker.service';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Hospital Tracker')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('mobile/hospitals')
export class HospitalTrackerController {
  constructor(private readonly hospitalService: HospitalTrackerService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Search for nearby hospitals/stroke centers using GPS coordinates' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude of the user' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude of the user' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Search radius in meters (default: 5000)' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Search keyword (default: stroke center hospital neurology)' })
  @ApiResponse({ status: 200, description: 'Returns list of nearby hospitals sorted by distance.' })
  searchNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.hospitalService.searchNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius, 10) : undefined,
      keyword,
    );
  }

  @Get(':placeId')
  @ApiOperation({ summary: 'Get detailed info for a specific hospital (address, phone, hours, website)' })
  @ApiResponse({ status: 200, description: 'Returns detailed hospital information.' })
  @ApiResponse({ status: 404, description: 'Hospital not found.' })
  getDetails(@Param('placeId') placeId: string) {
    return this.hospitalService.getDetails(placeId);
  }
}
