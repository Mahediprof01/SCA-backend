import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongooseConfig = (): MongooseModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
    dbName: configService.get<string>('DATABASE_NAME'),
  }),
  inject: [ConfigService],
});
