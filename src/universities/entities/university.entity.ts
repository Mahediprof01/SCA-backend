import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('universities')
export class University {
  @ApiProperty({ example: 1, description: 'Auto-generated ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Seoul National University', description: 'University name' })
  @Column({ length: 200 })
  name!: string;

  @ApiProperty({ example: 'Top university in South Korea...', description: 'Description' })
  @Column({ type: 'text' })
  description!: string;

  @ApiProperty({ example: 'Seoul', description: 'City / location' })
  @Column({ length: 200 })
  location!: string;

  @ApiProperty({ example: 'South Korea', description: 'Country' })
  @Column({ length: 100 })
  country!: string;

  @ApiProperty({ example: 1946, description: 'Year established' })
  @Column({ type: 'int', nullable: true })
  established?: number;

  @ApiProperty({ enum: ['public', 'private'], example: 'public' })
  @Column({
    type: 'enum',
    enum: ['public', 'private'],
    default: 'public',
  })
  type!: string;

  @ApiProperty({ example: 30, description: 'World ranking' })
  @Column({ type: 'int', nullable: true })
  ranking?: number;

  @ApiProperty({ example: '$5,000 per year', description: 'Tuition fee' })
  @Column({ length: 200, nullable: true })
  tuitionFee?: string;

  @ApiProperty({ example: 'https://www.snu.ac.kr', description: 'Website' })
  @Column({ length: 500, nullable: true })
  website?: string;

  @ApiProperty({ example: 'admissions@snu.ac.kr', description: 'Email' })
  @Column({ length: 255, nullable: true })
  email?: string;

  @ApiProperty({ example: '+82-2-880-5114', description: 'Phone' })
  @Column({ length: 50, nullable: true })
  phone?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...', description: 'Image URL' })
  @Column({ type: 'longtext', nullable: true })
  image?: string;

  @ApiProperty({ example: ['Computer Science', 'Engineering'], description: 'Programs' })
  @Column({ type: 'json', nullable: true })
  programs!: string[];

  @ApiProperty({ example: ['Library', 'Labs'], description: 'Facilities' })
  @Column({ type: 'json', nullable: true })
  facilities!: string[];

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status!: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;
}
