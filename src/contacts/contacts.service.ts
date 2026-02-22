import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
  ) {}

  /**
   * Create a new contact
   */
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    try {
      const contact = new this.contactModel(createContactDto);
      return await contact.save();
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Get all contacts with optional filtering
   */
  async findAll(
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Contact[]; total: number; page: number; limit: number }> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await this.contactModel.countDocuments(query);
    const data = await this.contactModel
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
   * Get a single contact by ID
   */
  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  /**
   * Update a contact
   */
  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.contactModel
      .findByIdAndUpdate(id, updateContactDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  /**
   * Delete a contact
   */
  async remove(id: string): Promise<{ message: string }> {
    const contact = await this.contactModel.findByIdAndDelete(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return { message: 'Contact deleted successfully' };
  }

  /**
   * Get contact statistics
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    pending: number;
    inactive: number;
  }> {
    const total = await this.contactModel.countDocuments();
    const active = await this.contactModel.countDocuments({ status: 'active' });
    const pending = await this.contactModel.countDocuments({
      status: 'pending',
    });
    const inactive = await this.contactModel.countDocuments({
      status: 'inactive',
    });

    return { total, active, pending, inactive };
  }
}
