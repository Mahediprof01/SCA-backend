import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('consultations')
export class Consultation {
  @ApiProperty({ example: 1, description: 'Auto-generated ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the person requesting consultation',
  })
  @Column({ length: 100 })
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @Column({ length: 255 })
  email!: string;

  @ApiProperty({
    example: '+8801306890908',
    description: 'Phone number in international format',
  })
  @Column({ length: 50 })
  phone!: string;

  @ApiProperty({
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    example: 'pending',
    description: 'Status of the consultation request',
  })
  @Column({
    type: 'enum',
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending',
  })
  status!: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date the consultation was created',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date the consultation was last updated',
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}
