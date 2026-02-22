import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class University extends Document {
  @ApiProperty({ example: 'Seoul National University', description: 'University name' })
  @Prop({ required: true })
  name!: string;

  @ApiProperty({ example: 'Top university in South Korea...', description: 'Description' })
  @Prop({ required: true })
  description!: string;

  @ApiProperty({ example: 'Seoul', description: 'City / location' })
  @Prop({ required: true })
  location!: string;

  @ApiProperty({ example: 'South Korea', description: 'Country' })
  @Prop({ required: true })
  country!: string;

  @ApiProperty({ example: 1946, description: 'Year established' })
  @Prop()
  established?: number;

  @ApiProperty({ enum: ['public', 'private'], example: 'public' })
  @Prop({ enum: ['public', 'private'], default: 'public' })
  type!: string;

  @ApiProperty({ example: 30, description: 'World ranking' })
  @Prop()
  ranking?: number;

  @ApiProperty({ example: '$5,000 per year', description: 'Tuition fee' })
  @Prop()
  tuitionFee?: string;

  @ApiProperty({ example: 'https://www.snu.ac.kr', description: 'Website' })
  @Prop()
  website?: string;

  @ApiProperty({ example: 'admissions@snu.ac.kr', description: 'Email' })
  @Prop()
  email?: string;

  @ApiProperty({ example: '+82-2-880-5114', description: 'Phone' })
  @Prop()
  phone?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...', description: 'Image URL' })
  @Prop()
  image?: string;

  @ApiProperty({ example: ['Computer Science', 'Engineering'], description: 'Programs' })
  @Prop({ type: [String], default: [] })
  programs!: string[];

  @ApiProperty({ example: ['Library', 'Labs'], description: 'Facilities' })
  @Prop({ type: [String], default: [] })
  facilities!: string[];

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export const UniversitySchema = SchemaFactory.createForClass(University);
