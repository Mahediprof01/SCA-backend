import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the person requesting consultation',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '+8801306890908',
    description: 'Phone number in international format',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;
}
