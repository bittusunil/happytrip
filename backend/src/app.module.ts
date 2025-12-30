import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FlightsModule } from './flights/flights.module';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'happytrip',
      password: process.env.DATABASE_PASSWORD || 'happytrip_password',
      database: process.env.DATABASE_NAME || 'happytrip_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://happytrip:happytrip_password@localhost:27017/happytrip_db?authSource=admin',
    ),
    AuthModule,
    UsersModule,
    FlightsModule,
    AccommodationsModule,
    BookingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
