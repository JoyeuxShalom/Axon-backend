import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmergencyContactsService } from './emergency-contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FirebaseAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Emergency Contacts')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('mobile/emergency-contacts')
export class EmergencyContactsController {
  constructor(private readonly contactsService: EmergencyContactsService) {}

  @Get()
  @ApiOperation({ summary: 'List all emergency contacts for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns list of emergency contacts.' })
  listContacts(@Req() req: any) {
    return this.contactsService.listContacts(req.user.uid);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new emergency contact' })
  @ApiResponse({ status: 201, description: 'Contact added successfully.' })
  addContact(@Req() req: any, @Body() dto: CreateContactDto) {
    return this.contactsService.addContact(req.user.uid, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing emergency contact' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  updateContact(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.updateContact(req.user.uid, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an emergency contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Contact not found.' })
  deleteContact(@Req() req: any, @Param('id') id: string) {
    return this.contactsService.deleteContact(req.user.uid, id);
  }

  @Post('sos')
  @ApiOperation({ summary: 'Trigger a manual SOS alert to all contacts' })
  @ApiResponse({ status: 200, description: 'SOS alert sent.' })
  triggerSOS(@Req() req: any) {
    return this.contactsService.triggerSOS(req.user.uid);
  }
}
