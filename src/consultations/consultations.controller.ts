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
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Consultation } from './entities/consultation.entity';

@ApiTags('Consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(
    private readonly consultationsService: ConsultationsService,
  ) {}

  /**
   * Create a new consultation booking
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Book a new consultation' })
  @ApiResponse({
    status: 201,
    description: 'Consultation booked successfully',
    type: Consultation,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(
    @Body() createConsultationDto: CreateConsultationDto,
  ): Promise<Consultation> {
    return this.consultationsService.create(createConsultationDto);
  }

  /**
   * Get all consultations with pagination and filtering
   */
  @Get()
  @ApiOperation({
    summary: 'Get all consultations with pagination and filtering',
  })
  @ApiQuery({
    name: 'status',
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in name, email, or phone',
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
    description: 'Consultations retrieved successfully',
  })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.consultationsService.findAll(status, search, page, limit);
  }

  /**
   * Get consultation statistics
   */
  @Get('stats/overview')
  @ApiOperation({ summary: 'Get consultation statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics() {
    return this.consultationsService.getStatistics();
  }

  /**
   * Get a single consultation by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single consultation by ID' })
  @ApiParam({
    name: 'id',
    description: 'Consultation ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Consultation retrieved successfully',
    type: Consultation,
  })
  @ApiNotFoundResponse({ description: 'Consultation not found' })
  async findOne(@Param('id') id: string): Promise<Consultation> {
    return this.consultationsService.findOne(id);
  }

  /**
   * Update a consultation
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a consultation' })
  @ApiParam({
    name: 'id',
    description: 'Consultation ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Consultation updated successfully',
    type: Consultation,
  })
  @ApiNotFoundResponse({ description: 'Consultation not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ): Promise<Consultation> {
    return this.consultationsService.update(id, updateConsultationDto);
  }

  /**
   * Delete a consultation
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a consultation' })
  @ApiParam({
    name: 'id',
    description: 'Consultation ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Consultation deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Consultation not found' })
  async remove(@Param('id') id: string) {
    return this.consultationsService.remove(id);
  }
}
