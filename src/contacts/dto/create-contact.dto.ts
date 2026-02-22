import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the contact',
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
    example: '+1 (555) 123-4567',
    description: 'Phone number',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: 'Inquiry about UK Universities',
    description: 'Subject of the contact',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  subject!: string;

  @ApiProperty({
    example: 'I am interested in studying Computer Science in the UK...',
    description: 'Full message content',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  message!: string;
}
