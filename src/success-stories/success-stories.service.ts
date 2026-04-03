import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto';
import { SuccessStory } from './entities/success-story.entity';

@Injectable()
export class SuccessStoriesService {
  constructor(
    @InjectRepository(SuccessStory)
    private readonly successStoryRepository: Repository<SuccessStory>,
  ) {}

  async create(dto: CreateSuccessStoryDto): Promise<SuccessStory> {
    const story = this.successStoryRepository.create({
      ...dto,
      status: dto.status ?? 'active',
    });
    return this.successStoryRepository.save(story);
  }

  async findAll(type?: string, status?: string): Promise<{ data: SuccessStory[]; total: number }> {
    const where: FindOptionsWhere<SuccessStory> = {};
    if (type) where.type = type as any;
    if (status) where.status = status as any;
    const data = await this.successStoryRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return { data, total: data.length };
  }

  async findPublic(): Promise<SuccessStory[]> {
    return this.successStoryRepository.find({
      where: { status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SuccessStory> {
    const story = await this.successStoryRepository.findOneBy({ id: Number(id) });
    if (!story) throw new NotFoundException(`Success story with ID ${id} not found`);
    return story;
  }

  async update(id: string, dto: UpdateSuccessStoryDto): Promise<SuccessStory> {
    const story = await this.successStoryRepository.findOneBy({ id: Number(id) });
    if (!story) throw new NotFoundException(`Success story with ID ${id} not found`);
    Object.assign(story, dto);
    return this.successStoryRepository.save(story);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.successStoryRepository.delete(Number(id));
    if (result.affected === 0) throw new NotFoundException(`Success story with ID ${id} not found`);
    return { message: 'Success story deleted successfully' };
  }
}
