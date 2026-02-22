import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateConsultationDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+8801306890908',
    description: 'Phone number',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    example: 'contacted',
    description: 'Status of the consultation',
    required: false,
  })
  @IsEnum(['pending', 'contacted', 'completed', 'cancelled'])
  @IsOptional()
  status?: string;
}
