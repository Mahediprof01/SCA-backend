import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSuccessStoryDto {
  @IsEnum(['image', 'video'])
  type!: 'image' | 'video';

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  videoUrl?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';
}
