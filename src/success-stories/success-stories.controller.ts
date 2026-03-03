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
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SuccessStoriesService } from './success-stories.service';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto';
import { SuccessStory } from './schemas/success-story.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('Success Stories')
@Controller('success-stories')
export class SuccessStoriesController {
  constructor(
    private readonly successStoriesService: SuccessStoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a success story (image or video)' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @Body(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    dto: CreateSuccessStoryDto,
    @UploadedFile() file?: any,
    @Req() req?: any,
  ): Promise<SuccessStory> {
    const payload: any = { ...dto };

    // Handle empty image object from multipart parsing
    if (payload.image && typeof payload.image === 'object' && Object.keys(payload.image).length === 0) {
      delete payload.image;
    }

    const uploadFile = file || req?.file;
    if (uploadFile) {
      payload.imageUrl = await this.cloudinaryService.uploadImage(uploadFile, 'success-stories');
    }

    return this.successStoriesService.create(payload);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all active success stories (public)' })
  async findAllPublic(): Promise<SuccessStory[]> {
    return this.successStoriesService.findAllPublic();
  }

  @Get()
  @ApiOperation({ summary: 'Get all success stories (admin)' })
  @ApiQuery({ name: 'type', required: false, enum: ['image', 'video'] })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.successStoriesService.findAll(
      type,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a success story by ID' })
  async findOne(@Param('id') id: string): Promise<SuccessStory> {
    return this.successStoriesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update a success story' })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, skipMissingProperties: true }))
    dto: UpdateSuccessStoryDto,
    @UploadedFile() file?: any,
    @Req() req?: any,
  ): Promise<SuccessStory> {
    const payload: any = { ...dto };

    const uploadFile = file || req?.file;
    if (uploadFile) {
      payload.imageUrl = await this.cloudinaryService.uploadImage(uploadFile, 'success-stories');
    }

    return this.successStoriesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a success story' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.successStoriesService.remove(id);
  }
}
