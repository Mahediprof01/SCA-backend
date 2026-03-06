import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsEmail,
  IsArray,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateUniversityDto {
  @ApiProperty({ example: 'Seoul National University', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiProperty({ example: 'Top university...', required: false })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ example: 'Seoul', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;

  @ApiProperty({ example: 'South Korea', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ example: 1946, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1000)
  @Max(2100)
  @Type(() => Number)
  established?: number;

  @ApiProperty({ enum: ['public', 'private'], required: false })
  @IsEnum(['public', 'private'])
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 30, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  ranking?: number;

  @ApiProperty({ example: '$5,000 per year', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  tuitionFee?: string;

  @ApiProperty({ example: 'https://www.snu.ac.kr', required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'admissions@snu.ac.kr', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+82-2-880-5114', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  image?: string;

  @ApiProperty({ example: ['Computer Science', 'Engineering'], required: false })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    }
    return value;
  })
  @IsArray({ message: 'programs must be an array' })
  @IsString({ each: true })
  @IsOptional()
  programs?: string[];

  @ApiProperty({ example: ['Library', 'Labs'], required: false })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return undefined;
      }
    }
    return value;
  })
  @IsArray({ message: 'facilities must be an array' })
  @IsString({ each: true })
  @IsOptional()
  facilities?: string[];

  @ApiProperty({ enum: ['active', 'inactive'], required: false })
  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
