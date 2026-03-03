import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @ApiProperty({ example: 'Mahmudul Hasan', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiProperty({ example: 'Kyung Hee University (South Korea)', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(300)
  university?: string;

  @ApiProperty({ example: 'Great experience...', required: false })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(2000)
  quote?: string;

  @ApiProperty({ example: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @ApiProperty({ enum: ['active', 'inactive'], required: false })
  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
