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
  BadRequestException,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  /**
   * Create a new university
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new university' })
  @ApiResponse({
    status: 201,
    description: 'University created successfully',
    type: University,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async create(
    @Body(new ValidationPipe({ transform: true, skipMissingProperties: true })) createUniversityDto: CreateUniversityDto,
    @UploadedFile() file?: any,
  ): Promise<University> {
    let imageUrl: string | undefined;

    // Handle the case where file was parsed as empty object {} into the DTO body
    if (createUniversityDto.image && typeof createUniversityDto.image === 'object' && Object.keys(createUniversityDto.image).length === 0) {
      delete (createUniversityDto as any).image;
    }

    // Upload image to Cloudinary if provided
    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(
        file,
        'universities',
      );
    }

    // If image URL is provided in body and no file, use that
    if (!imageUrl && createUniversityDto.image && typeof createUniversityDto.image === 'string') {
      imageUrl = createUniversityDto.image;
    }

    // Create payload with uploaded image URL
    const payload: any = {
      ...createUniversityDto,
      image: imageUrl,
    };

    return this.universitiesService.create(payload);
  }

  /**
   * Get university statistics
   */
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

  /**
   * Get all active universities (public endpoint, no pagination)
   */
  @Get('public')
  @ApiOperation({ summary: 'Get all active universities for public site' })
  @ApiResponse({
    status: 200,
    description: 'Active universities retrieved successfully',
  })
  async findAllActive(): Promise<University[]> {
    return this.universitiesService.findAllActive();
  }

  /**
   * Get all universities with pagination and filtering
   */
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

  /**
   * Get a single university by ID
   */
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

  /**
   * Update a university
   */
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
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
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, skipMissingProperties: true })) updateUniversityDto: UpdateUniversityDto,
    @UploadedFile() file?: any,
    @Req() req?: any,
  ): Promise<University> {
    const payload: any = { ...updateUniversityDto };

    // Handle the case where file was parsed as empty object {} into the DTO body
    if (updateUniversityDto.image && typeof updateUniversityDto.image === 'object' && Object.keys(updateUniversityDto.image).length === 0) {
      delete payload.image;
    }

    // Try using req.file if @UploadedFile() didn't work
    const uploadFile = file || req?.file;
    
    // Only update image if we have a new file to upload
    if (uploadFile) {
      const imageUrl = await this.cloudinaryService.uploadImage(
        uploadFile,
        'universities',
      );
      payload.image = imageUrl;
    } else if (payload.image && typeof payload.image === 'string') {
      // If no file but explicit image URL provided in DTO, use it
    } else {
      delete payload.image;
    }

    return this.universitiesService.update(id, payload);
  }

  /**
   * Delete a university
   */
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
