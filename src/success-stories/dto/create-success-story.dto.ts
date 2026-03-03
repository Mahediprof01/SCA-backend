import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateSuccessStoryDto {
  @ApiProperty({ enum: ['image', 'video'], example: 'image' })
  @IsEnum(['image', 'video'])
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ example: 'Visa Approved!', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Student got visa to study abroad.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=...', required: false })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({ enum: ['active', 'inactive'], required: false })
  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
