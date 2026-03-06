import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto';
import { SuccessStory } from './schemas/success-story.schema';

@Injectable()
export class SuccessStoriesService {
  constructor(
    @InjectModel(SuccessStory.name)
    private readonly successStoryModel: Model<SuccessStory>,
  ) {}

  async create(dto: CreateSuccessStoryDto): Promise<SuccessStory> {
    const story = new this.successStoryModel({
      ...dto,
      status: dto.status ?? 'active',
    });
    return story.save();
  }

  async findAll(type?: string, status?: string): Promise<{ data: SuccessStory[]; total: number }> {
    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (status) query.status = status;
    const data = await this.successStoryModel.find(query).sort({ createdAt: -1 }).exec();
    return { data, total: data.length };
  }

  async findPublic(): Promise<SuccessStory[]> {
    return this.successStoryModel.find({ status: 'active' }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<SuccessStory> {
    const story = await this.successStoryModel.findById(id).exec();
    if (!story) throw new NotFoundException(`Success story with ID ${id} not found`);
    return story;
  }

  async update(id: string, dto: UpdateSuccessStoryDto): Promise<SuccessStory> {
    const story = await this.successStoryModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!story) throw new NotFoundException(`Success story with ID ${id} not found`);
    return story;
  }

  async remove(id: string): Promise<{ message: string }> {
    const story = await this.successStoryModel.findByIdAndDelete(id).exec();
    if (!story) throw new NotFoundException(`Success story with ID ${id} not found`);
    return { message: 'Success story deleted successfully' };
  }
}
