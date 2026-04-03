import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('success_stories')
export class SuccessStory {
  @ApiProperty({ example: 1, description: 'Auto-generated ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ enum: ['image', 'video'], example: 'image' })
  @Column({
    type: 'enum',
    enum: ['image', 'video'],
  })
  type!: 'image' | 'video';

  @ApiProperty({ example: 'Visa Approved!', required: false })
  @Column({ length: 255, nullable: true })
  title?: string;

  @ApiProperty({ example: 'Student got visa to study in South Korea.', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
  @Column({ type: 'longtext', nullable: true })
  imageUrl?: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=...', required: false })
  @Column({ length: 500, nullable: true })
  videoUrl?: string;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status!: 'active' | 'inactive';

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;
}
