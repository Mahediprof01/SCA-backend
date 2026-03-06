import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { SuccessStoriesController } from './success-stories.controller';
import { SuccessStoriesService } from './success-stories.service';
import { SuccessStory, SuccessStorySchema } from './schemas/success-story.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SuccessStory.name, schema: SuccessStorySchema }]),
    CloudinaryModule,
  ],
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService],
  exports: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
