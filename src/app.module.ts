import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { UniversitiesModule } from './universities/universities.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SuccessStoriesModule } from './success-stories/success-stories.module';
import { mongooseConfig } from './config/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync(mongooseConfig()),
    ContactsModule,
    ConsultationsModule,
    UniversitiesModule,
    ReviewsModule,
    SuccessStoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
