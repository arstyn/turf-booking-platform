import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../database/entities/otp.entity';
import { OtpService } from './otp.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Otp]), EmailModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
