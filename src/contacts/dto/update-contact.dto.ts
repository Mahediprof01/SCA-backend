import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateContactDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the contact',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+1 (555) 123-4567',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    example: 'Inquiry about UK Universities',
    description: 'Subject of the contact',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  subject?: string;

  @ApiProperty({
    example: 'I am interested in studying Computer Science in the UK...',
    description: 'Full message content',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message?: string;

  @ApiProperty({
    enum: ['active', 'inactive', 'pending'],
    example: 'active',
    description: 'Status of the contact',
    required: false,
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'pending'])
  status?: string;

  @ApiProperty({
    example: '3.75',
    description: 'CGPA of the applicant',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  cgpa?: string;
}
