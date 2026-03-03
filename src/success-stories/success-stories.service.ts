import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuccessStory } from './schemas/success-story.schema';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto';

@Injectable()
export class SuccessStoriesService {
  constructor(
    @InjectModel(SuccessStory.name) private successStoryModel: Model<SuccessStory>,
  ) {}

  async create(data: any): Promise<SuccessStory> {
    const story = new this.successStoryModel(data);
    return await story.save();
  }

  async findAll(
    type?: string,
    status?: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: SuccessStory[]; total: number; page: number; limit: number }> {
    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await this.successStoryModel.countDocuments(query);
    const data = await this.successStoryModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return { data, total, page, limit };
  }

  async findAllPublic(): Promise<SuccessStory[]> {
    return this.successStoryModel
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .exec();
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
