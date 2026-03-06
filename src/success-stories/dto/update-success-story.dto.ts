import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSuccessStoryDto {
  @IsEnum(['image', 'video'])
  @IsOptional()
  type?: 'image' | 'video';

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
  videoUrl?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';
}
