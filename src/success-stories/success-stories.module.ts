import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { SuccessStoriesController } from './success-stories.controller';
import { SuccessStoriesService } from './success-stories.service';
import { SuccessStory } from './entities/success-story.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SuccessStory]),
    CloudinaryModule,
  ],
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService],
  exports: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
