import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { SpecialistsService } from './specialists.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Specialists Directory')
@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Get()
  @ApiOperation({ summary: 'List all specialists with optional filters' })
  @ApiQuery({ name: 'category', required: false, enum: ['neurologist', 'cardiologist'], description: 'Filter by category' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or specialty' })
  @ApiResponse({ status: 200, description: 'Returns list of specialists.' })
  listSpecialists(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.specialistsService.listSpecialists(category, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single specialist by ID' })
  @ApiResponse({ status: 200, description: 'Returns the specialist details.' })
  @ApiResponse({ status: 404, description: 'Specialist not found.' })
  getSpecialist(@Param('id') id: string) {
    return this.specialistsService.getSpecialistById(id);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new specialist (Admin)' })
  @ApiResponse({ status: 201, description: 'Specialist added successfully.' })
  createSpecialist(@Body() dto: CreateSpecialistDto) {
    return this.specialistsService.createSpecialist(dto);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specialist (Admin)' })
  @ApiResponse({ status: 200, description: 'Specialist updated successfully.' })
  @ApiResponse({ status: 404, description: 'Specialist not found.' })
  updateSpecialist(@Param('id') id: string, @Body() dto: UpdateSpecialistDto) {
    return this.specialistsService.updateSpecialist(id, dto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specialist (Admin)' })
  @ApiResponse({ status: 200, description: 'Specialist deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Specialist not found.' })
  deleteSpecialist(@Param('id') id: string) {
    return this.specialistsService.deleteSpecialist(id);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed the specialists collection with default data' })
  @ApiResponse({ status: 201, description: 'Default data seeded.' })
  seedDefaults() {
    return this.specialistsService.seedDefaults();
  }
}
