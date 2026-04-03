import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { UniversitiesModule } from './universities/universities.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SuccessStoriesModule } from './success-stories/success-stories.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig()),
    ContactsModule,
    ConsultationsModule,
    UniversitiesModule,
    ReviewsModule,
    SuccessStoriesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
