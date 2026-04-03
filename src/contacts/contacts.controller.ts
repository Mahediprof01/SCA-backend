import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /**
   * Create a new contact
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({
    status: 201,
    description: 'Contact created successfully',
    type: Contact,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or email already exists',
  })
  async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactsService.create(createContactDto);
  }

  /**
   * Get all contacts with pagination and filtering
   */
  @Get()
  @ApiOperation({ summary: 'Get all contacts with pagination and filtering' })
  @ApiQuery({
    name: 'status',
    enum: ['active', 'inactive', 'pending'],
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in name, email, or subject',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Contacts retrieved successfully',
  })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.contactsService.findAll(status, search, page, limit);
  }

  /**
   * Get a single contact by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single contact by ID' })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Contact retrieved successfully',
    type: Contact,
  })
  @ApiNotFoundResponse({ description: 'Contact not found' })
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactsService.findOne(id);
  }

  /**
   * Update a contact
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Contact updated successfully',
    type: Contact,
  })
  @ApiNotFoundResponse({ description: 'Contact not found' })
  @ApiBadRequestResponse({
    description: 'Invalid input',
  })
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactsService.update(id, updateContactDto);
  }

  /**
   * Delete a contact
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiParam({
    name: 'id',
    description: 'Contact ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Contact deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Contact not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.contactsService.remove(id);
  }

  /**
   * Get contact statistics
   */
  @Get('stats/overview')
  @ApiOperation({ summary: 'Get contact statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        pending: { type: 'number' },
        inactive: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    total: number;
    active: number;
    pending: number;
    inactive: number;
  }> {
    return this.contactsService.getStatistics();
  }
}
