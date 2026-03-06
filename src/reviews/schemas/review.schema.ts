import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  university!: string;

  @Prop({ required: true, trim: true })
  quote!: string;

  @Prop({ required: true, min: 1, max: 5, default: 5 })
  rating!: number;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: 'active' | 'inactive';

  createdAt!: Date;
  updatedAt!: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
