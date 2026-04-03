import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private readonly reviewRepository: Repository<Review>) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async findAll(
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    const safePage = Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    const qb = this.reviewRepository.createQueryBuilder('review');

    if (status) {
      qb.andWhere('review.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(review.name LIKE :search OR review.university LIKE :search OR review.quote LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy('review.createdAt', 'DESC')
      .skip(skip)
      .take(safeLimit)
      .getMany();

    return { data, total, page: safePage, limit: safeLimit };
  }

  async findAllActive(): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({ id: Number(id) });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({ id: Number(id) });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.reviewRepository.delete(Number(id));
    if (result.affected === 0) {
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
    const total = await this.reviewRepository.count();
    const active = await this.reviewRepository.count({ where: { status: 'active' } });
    const inactive = await this.reviewRepository.count({ where: { status: 'inactive' } });

    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .getRawOne();

    return {
      total,
      active,
      inactive,
      averageRating: Number((result?.averageRating ?? 0).toFixed(1)),
    };
  }
}
