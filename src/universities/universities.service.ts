import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from './entities/university.entity';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University) private universityRepository: Repository<University>,
  ) {}

  /**
   * Create a new university
   */
  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    const university = this.universityRepository.create(createUniversityDto);
    return await this.universityRepository.save(university);
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
    const qb = this.universityRepository.createQueryBuilder('university');

    if (status) {
      qb.andWhere('university.status = :status', { status });
    }

    if (country) {
      qb.andWhere('university.country LIKE :country', { country: `%${country}%` });
    }

    if (search) {
      qb.andWhere(
        '(university.name LIKE :search OR university.location LIKE :search OR university.country LIKE :search OR university.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;
    const total = await qb.getCount();
    const data = await qb
      .orderBy('university.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return { data, total, page, limit };
  }

  /**
   * Get all active universities (for public site, no pagination)
   */
  async findAllActive(): Promise<University[]> {
    return this.universityRepository.find({
      where: { status: 'active' },
      order: { ranking: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get a single university by ID
   */
  async findOne(id: string): Promise<University> {
    const university = await this.universityRepository.findOneBy({ id: Number(id) });
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
    const university = await this.universityRepository.findOneBy({ id: Number(id) });
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    Object.assign(university, updateUniversityDto);
    return this.universityRepository.save(university);
  }

  /**
   * Delete a university
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.universityRepository.delete(Number(id));
    if (result.affected === 0) {
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
    const total = await this.universityRepository.count();
    const active = await this.universityRepository.count({ where: { status: 'active' } });
    const inactive = await this.universityRepository.count({ where: { status: 'inactive' } });
    const countriesResult = await this.universityRepository
      .createQueryBuilder('university')
      .select('DISTINCT university.country')
      .getRawMany();
    const publicType = await this.universityRepository.count({ where: { type: 'public' } });
    const privateType = await this.universityRepository.count({ where: { type: 'private' } });

    return {
      total,
      active,
      inactive,
      countries: countriesResult.length,
      publicType,
      privateType,
    };
  }
}
