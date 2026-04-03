import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reviews')
export class Review {
  @ApiProperty({ example: 1, description: 'Auto-generated ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Mahmudul Hasan', description: 'Student name' })
  @Column({ length: 255 })
  name!: string;

  @ApiProperty({ example: 'Kyung Hee University (South Korea)', description: 'University and country' })
  @Column({ length: 255 })
  university!: string;

  @ApiProperty({
    example: 'From the first counselling session to my visa approval...',
    description: 'Review quote',
  })
  @Column({ type: 'text' })
  quote!: string;

  @ApiProperty({ example: 5, description: 'Star rating (1-5)' })
  @Column({ type: 'int', default: 5 })
  rating!: number;

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
