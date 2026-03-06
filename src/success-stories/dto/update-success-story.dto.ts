import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSuccessStoryDto {
  @ApiProperty({ enum: ['image', 'video'], required: false })
  @IsEnum(['image', 'video'])
  @IsOptional()
  type?: 'image' | 'video';

  @ApiProperty({ example: 'New Title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated description.', required: false })
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
  status?: 'active' | 'inactive';
}
