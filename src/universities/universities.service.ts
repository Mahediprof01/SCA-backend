import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { University } from './schemas/university.schema';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University.name) private universityModel: Model<University>,
  ) {}

  /**
   * Create a new university
   */
  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    const university = new this.universityModel(createUniversityDto);
    return await university.save();
  }

  /**
   * Get all universities with optional filtering and pagination
   */
  async findAll(
    status?: string,
    country?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: University[]; total: number; page: number; limit: number }> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await this.universityModel.countDocuments(query);
    const data = await this.universityModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Get all active universities (for public site, no pagination)
   */
  async findAllActive(): Promise<University[]> {
    return this.universityModel
      .find({ status: 'active' })
      .sort({ ranking: 1, name: 1 })
      .exec();
  }

  /**
   * Get a single university by ID
   */
  async findOne(id: string): Promise<University> {
    const university = await this.universityModel.findById(id).exec();
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  /**
   * Update a university
   */
  async update(
    id: string,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<University> {
    const university = await this.universityModel
      .findByIdAndUpdate(id, updateUniversityDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  /**
   * Delete a university
   */
  async remove(id: string): Promise<{ message: string }> {
    const university = await this.universityModel.findByIdAndDelete(id).exec();
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return { message: 'University deleted successfully' };
  }

  /**
   * Get university statistics
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    countries: number;
    publicType: number;
    privateType: number;
  }> {
    const total = await this.universityModel.countDocuments();
    const active = await this.universityModel.countDocuments({ status: 'active' });
    const inactive = await this.universityModel.countDocuments({ status: 'inactive' });
    const countries = await this.universityModel.distinct('country');
    const publicType = await this.universityModel.countDocuments({ type: 'public' });
    const privateType = await this.universityModel.countDocuments({ type: 'private' });

    return {
      total,
      active,
      inactive,
      countries: countries.length,
      publicType,
      privateType,
    };
  }
}
