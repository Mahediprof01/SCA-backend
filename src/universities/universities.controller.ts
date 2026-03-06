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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { University } from './schemas/university.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(
    private readonly universitiesService: UniversitiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new university' })
  @ApiResponse({
    status: 201,
    description: 'University created successfully',
    type: University,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createUniversityDto: CreateUniversityDto,
    @UploadedFile() image?: { mimetype: string; buffer: Buffer },
  ): Promise<University> {
    if (image) {
      createUniversityDto.image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    }
    return this.universitiesService.create(createUniversityDto);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get university statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        countries: { type: 'number' },
        publicType: { type: 'number' },
        privateType: { type: 'number' },
      },
    },
  })
  async getStatistics() {
    return this.universitiesService.getStatistics();
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all active universities for public site' })
  @ApiResponse({
    status: 200,
    description: 'Active universities retrieved successfully',
  })
  async findAllActive(): Promise<University[]> {
    return this.universitiesService.findAllActive();
  }

  @Get()
  @ApiOperation({ summary: 'Get all universities with pagination and filtering' })
  @ApiQuery({
    name: 'status',
    enum: ['active', 'inactive'],
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'Filter by country',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in name, location, country, or description',
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
    description: 'Universities retrieved successfully',
  })
  async findAll(
    @Query('status') status?: string,
    @Query('country') country?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.universitiesService.findAll(status, country, search, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single university by ID' })
  @ApiParam({
    name: 'id',
    description: 'University ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'University retrieved successfully',
    type: University,
  })
  @ApiNotFoundResponse({ description: 'University not found' })
  async findOne(@Param('id') id: string): Promise<University> {
    return this.universitiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a university' })
  @ApiParam({
    name: 'id',
    description: 'University ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'University updated successfully',
    type: University,
  })
  @ApiNotFoundResponse({ description: 'University not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
    @UploadedFile() image?: { mimetype: string; buffer: Buffer },
  ): Promise<University> {
    if (image) {
      updateUniversityDto.image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    }
    return this.universitiesService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a university' })
  @ApiParam({
    name: 'id',
    description: 'University ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'University deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'University not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.universitiesService.remove(id);
  }
}
