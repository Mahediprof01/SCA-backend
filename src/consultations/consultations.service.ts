import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);

  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    private configService: ConfigService,
  ) {}

  async create(
    createConsultationDto: CreateConsultationDto,
  ): Promise<Consultation> {
    const consultation = this.consultationRepository.create(createConsultationDto);
    const saved = await this.consultationRepository.save(consultation);

    this.sendNotificationEmail(saved).catch((err) =>
      this.logger.error('Failed to send consultation notification email', err),
    );

    return saved;
  }

  /**
   * Get all consultations with optional filtering and pagination
   */
  async findAll(
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Consultation[];
    total: number;
    page: number;
    limit: number;
  }> {
    const qb = this.consultationRepository.createQueryBuilder('consultation');

    if (status) {
      qb.andWhere('consultation.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(consultation.name LIKE :search OR consultation.email LIKE :search OR consultation.phone LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const skip = (page - 1) * limit;
    const total = await qb.getCount();
    const data = await qb
      .orderBy('consultation.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    return { data, total, page, limit };
  }

  /**
   * Get a single consultation by ID
   */
  async findOne(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOneBy({ id: Number(id) });
    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }
    return consultation;
  }

  /**
   * Update a consultation
   */
  async update(
    id: string,
    updateConsultationDto: UpdateConsultationDto,
  ): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOneBy({ id: Number(id) });
    if (!consultation) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }
    Object.assign(consultation, updateConsultationDto);
    return this.consultationRepository.save(consultation);
  }

  /**
   * Delete a consultation
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.consultationRepository.delete(Number(id));
    if (result.affected === 0) {
      throw new NotFoundException(`Consultation with ID ${id} not found`);
    }
    return { message: 'Consultation deleted successfully' };
  }

  /**
   * Get consultation statistics
   */
  async getStatistics(): Promise<{
    total: number;
    pending: number;
    contacted: number;
    completed: number;
    cancelled: number;
  }> {
    const total = await this.consultationRepository.count();
    const pending = await this.consultationRepository.count({ where: { status: 'pending' } });
    const contacted = await this.consultationRepository.count({ where: { status: 'contacted' } });
    const completed = await this.consultationRepository.count({ where: { status: 'completed' } });
    const cancelled = await this.consultationRepository.count({ where: { status: 'cancelled' } });

    return { total, pending, contacted, completed, cancelled };
  }

  /**
   * Send email notification via Resend (free — no SMTP needed)
   * Free tier: 3,000 emails/month, 100/day
   * Sign up at https://resend.com — no credit card required
   */
  private async sendNotificationEmail(
    consultation: Consultation,
  ): Promise<void> {
    const apiKey = this.configService.get<string>('RESEND_API_KEY', '');
    const fromEmail = this.configService.get<string>(
      'RESEND_FROM_EMAIL',
      'onboarding@resend.dev',
    );
    const notifyEmail = this.configService.get<string>(
      'NOTIFICATION_EMAIL',
      'mahedi.prof@gmail.com',
    );

    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY not set — skipping email notification. ' +
          'Get a free key at https://resend.com and add it to .env',
      );
      return;
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `Study Abroad Consultancy <${fromEmail}>`,
      to: [notifyEmail],
      subject: `New Consultation Booking — ${consultation.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db;">New Consultation Request</h2>
          <p>A new consultation has been booked on the website:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 12px; background: #f3f4f6; font-weight: bold; width: 120px;">Name</td>
              <td style="padding: 8px 12px; background: #f3f4f6;">${consultation.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Email</td>
              <td style="padding: 8px 12px;"><a href="mailto:${consultation.email}">${consultation.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f3f4f6; font-weight: bold;">Phone</td>
              <td style="padding: 8px 12px; background: #f3f4f6;"><a href="tel:${consultation.phone}">${consultation.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Status</td>
              <td style="padding: 8px 12px;">${consultation.status}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f3f4f6; font-weight: bold;">Date</td>
              <td style="padding: 8px 12px; background: #f3f4f6;">${new Date(consultation.createdAt).toLocaleString()}</td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 13px;">
            This is an automated notification from Study Abroad Consultancy.
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    this.logger.log(`Notification email sent to ${notifyEmail} via Resend`);
  }
}
