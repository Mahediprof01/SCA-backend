import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
  ) {}

  /**
   * Create a new contact
   */
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    try {
      const contact = this.contactRepository.create(createContactDto);
      return await this.contactRepository.save(contact);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
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
    const qb = this.contactRepository.createQueryBuilder('contact');

    if (status) {
      qb.andWhere('contact.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(contact.name LIKE :search OR contact.email LIKE :search OR contact.subject LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;
    const total = await qb.getCount();
    const data = await qb
      .orderBy('contact.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return { data, total, page, limit };
  }

  /**
   * Get a single contact by ID
   */
  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOneBy({ id: Number(id) });
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
    const contact = await this.contactRepository.findOneBy({ id: Number(id) });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    Object.assign(contact, updateContactDto);
    return this.contactRepository.save(contact);
  }

  /**
   * Delete a contact
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.contactRepository.delete(Number(id));
    if (result.affected === 0) {
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
    const total = await this.contactRepository.count();
    const active = await this.contactRepository.count({ where: { status: 'active' } });
    const pending = await this.contactRepository.count({ where: { status: 'pending' } });
    const inactive = await this.contactRepository.count({ where: { status: 'inactive' } });

    return { total, active, pending, inactive };
  }
}
