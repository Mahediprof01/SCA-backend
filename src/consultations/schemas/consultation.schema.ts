import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Consultation extends Document {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the person requesting consultation',
  })
  @Prop({ required: true })
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @Prop({ required: true })
  email!: string;

  @ApiProperty({
    example: '+8801306890908',
    description: 'Phone number in international format',
  })
  @Prop({ required: true })
  phone!: string;

  @ApiProperty({
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    example: 'pending',
    description: 'Status of the consultation request',
  })
  @Prop({
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending',
  })
  status!: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date the consultation was created',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Date the consultation was last updated',
  })
  updatedAt!: Date;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
