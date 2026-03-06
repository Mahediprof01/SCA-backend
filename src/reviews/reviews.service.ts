import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<Review>) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this.reviewModel(createReviewDto);
    return review.save();
  }

  async findAll(
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    const query: any = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } },
        { quote: { $regex: search, $options: 'i' } },
      ];
    }

    const safePage = Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    const total = await this.reviewModel.countDocuments(query);
    const data = await this.reviewModel
      .find(query)
      .skip(skip)
      .limit(safeLimit)
      .sort({ createdAt: -1 })
      .exec();

    return { data, total, page: safePage, limit: safeLimit };
  }

  async findAllActive(): Promise<Review[]> {
    return this.reviewModel.find({ status: 'active' }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true, runValidators: true })
      .exec();

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async remove(id: string): Promise<{ message: string }> {
    const review = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return { message: 'Review deleted successfully' };
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    averageRating: number;
  }> {
    const total = await this.reviewModel.countDocuments();
    const active = await this.reviewModel.countDocuments({ status: 'active' });
    const inactive = await this.reviewModel.countDocuments({ status: 'inactive' });

    const rating = await this.reviewModel.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    return {
      total,
      active,
      inactive,
      averageRating: Number((rating[0]?.averageRating ?? 0).toFixed(1)),
    };
  }
}
