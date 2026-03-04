import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Contact extends Document {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the contact',
  })
  @Prop({ required: true })
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @Prop({ required: true, unique: true })
  email!: string;

  @ApiProperty({
    example: '+1 (555) 123-4567',
    description: 'Phone number',
  })
  @Prop({ required: true })
  phone!: string;

  @ApiProperty({
    example: 'Inquiry about UK Universities',
    description: 'Subject of the contact',
  })
  @Prop({ required: true })
  subject!: string;

  @ApiProperty({
    example: 'I am interested in studying Computer Science...',
    description: 'Full message content',
  })
  @Prop({ required: true })
  message!: string;

  @ApiProperty({
    example: '3.75',
    description: 'CGPA of the applicant',
    required: false,
  })
  @Prop({ required: false })
  cgpa?: string;

  @ApiProperty({
    enum: ['active', 'inactive', 'pending'],
    example: 'active',
    description: 'Status of the contact',
  })
  @Prop({ enum: ['active', 'inactive', 'pending'], default: 'pending' })
  status!: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  @Prop()
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  @Prop()
  updatedAt!: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
