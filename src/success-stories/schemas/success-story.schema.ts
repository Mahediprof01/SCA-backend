import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class SuccessStory extends Document {
  @ApiProperty({ enum: ['image', 'video'], example: 'image' })
  @Prop({ required: true, enum: ['image', 'video'] })
  type!: string;

  @ApiProperty({ example: 'Visa Approved!', required: false })
  @Prop()
  title?: string;

  @ApiProperty({ example: 'Student got visa to study in South Korea.', required: false })
  @Prop()
  description?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
  @Prop()
  imageUrl?: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=...', required: false })
  @Prop()
  videoUrl?: string;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export const SuccessStorySchema = SchemaFactory.createForClass(SuccessStory);
