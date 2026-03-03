import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Review extends Document {
  @ApiProperty({ example: 'Mahmudul Hasan', description: 'Student name' })
  @Prop({ required: true })
  name!: string;

  @ApiProperty({ example: 'Kyung Hee University (South Korea)', description: 'University and country' })
  @Prop({ required: true })
  university!: string;

  @ApiProperty({
    example: 'From the first counselling session to my visa approval...',
    description: 'Review quote',
  })
  @Prop({ required: true })
  quote!: string;

  @ApiProperty({ example: 5, description: 'Star rating (1-5)' })
  @Prop({ required: true, min: 1, max: 5, default: 5 })
  rating!: number;

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
