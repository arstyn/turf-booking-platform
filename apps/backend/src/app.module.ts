import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TurfsModule } from './turfs/turfs.module';
import { BookingsModule } from './bookings/bookings.module';
import { User } from './entities/user.entity';
import { Turf } from './entities/turf.entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'turf-booking.db',
      entities: [User, Turf, Booking],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    TurfsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
