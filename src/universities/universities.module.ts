import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { University } from './entities/university.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([University]),
    CloudinaryModule,
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
})
export class UniversitiesModule {}
