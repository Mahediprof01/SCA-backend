import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto';
import { SuccessStory } from './schemas/success-story.schema';
import { SuccessStoriesService } from './success-stories.service';

@Controller('success-stories')
export class SuccessStoriesController {
  constructor(private readonly successStoriesService: SuccessStoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() body: CreateSuccessStoryDto,
    @UploadedFile() image?: { mimetype: string; buffer: Buffer },
  ): Promise<SuccessStory> {
    const payload: CreateSuccessStoryDto = { ...body };

    if (image) {
      payload.imageUrl = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    }

    if (payload.type === 'video') payload.imageUrl = undefined;
    if (payload.type === 'image') payload.videoUrl = undefined;

    return this.successStoriesService.create(payload);
  }

  @Get('public')
  async findPublic(): Promise<SuccessStory[]> {
    return this.successStoriesService.findPublic();
  }

  @Get()
  async findAll(@Query('type') type?: string, @Query('status') status?: string) {
    return this.successStoriesService.findAll(type, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessStory> {
    return this.successStoriesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSuccessStoryDto: UpdateSuccessStoryDto): Promise<SuccessStory> {
    return this.successStoriesService.update(id, updateSuccessStoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.successStoriesService.remove(id);
  }
}
