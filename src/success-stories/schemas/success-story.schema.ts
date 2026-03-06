import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SuccessStory extends Document {
  @ApiProperty({ enum: ['image', 'video'], example: 'image' })
  @Prop({ enum: ['image', 'video'], required: true })
  type!: 'image' | 'video';

  @ApiProperty({ example: 'Visa Approved!', required: false })
  @Prop({ trim: true })
  title?: string;

  @ApiProperty({ example: 'Student got visa to study in South Korea.', required: false })
  @Prop({ trim: true })
  description?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
  @Prop()
  imageUrl?: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=...', required: false })
  @Prop()
  videoUrl?: string;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: 'active' | 'inactive';

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export const SuccessStorySchema = SchemaFactory.createForClass(SuccessStory);
