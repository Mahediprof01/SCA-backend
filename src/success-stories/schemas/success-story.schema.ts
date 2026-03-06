import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SuccessStory extends Document {
  @Prop({ enum: ['image', 'video'], required: true })
  type!: 'image' | 'video';

  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  videoUrl?: string;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: 'active' | 'inactive';

  createdAt!: Date;
  updatedAt!: Date;
}

export const SuccessStorySchema = SchemaFactory.createForClass(SuccessStory);
