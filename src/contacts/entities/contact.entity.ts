import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('contacts')
export class Contact {
  @ApiProperty({ example: 1, description: 'Auto-generated ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the contact',
  })
  @Column({ length: 100 })
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @Column({ length: 255, unique: true })
  email!: string;

  @ApiProperty({
    example: '+1 (555) 123-4567',
    description: 'Phone number',
  })
  @Column({ length: 50 })
  phone!: string;

  @ApiProperty({
    example: 'Inquiry about UK Universities',
    description: 'Subject of the contact',
  })
  @Column({ length: 200 })
  subject!: string;

  @ApiProperty({
    example: 'I am interested in studying Computer Science...',
    description: 'Full message content',
  })
  @Column({ type: 'text' })
  message!: string;

  @ApiProperty({
    example: '3.75',
    description: 'CGPA of the applicant',
    required: false,
  })
  @Column({ length: 10, nullable: true })
  cgpa?: string;

  @ApiProperty({
    enum: ['active', 'inactive', 'pending'],
    example: 'active',
    description: 'Status of the contact',
  })
  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  })
  status!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
