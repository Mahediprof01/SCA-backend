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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: Review })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createReviewDto);
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get review statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics() {
    return this.reviewsService.getStatistics();
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all active reviews for public site' })
  @ApiResponse({ status: 200, description: 'Active reviews retrieved successfully' })
  async findAllActive(): Promise<Review[]> {
    return this.reviewsService.findAllActive();
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with pagination and filtering' })
  @ApiQuery({ name: 'status', enum: ['active', 'inactive'], required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewsService.findAll(status, search, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID', type: String })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully', type: Review })
  @ApiNotFoundResponse({ description: 'Review not found' })
  async findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', description: 'Review ID', type: String })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: Review })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', description: 'Review ID', type: String })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.reviewsService.remove(id);
  }
}
