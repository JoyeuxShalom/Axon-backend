import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HospitalTrackerController } from './hospital-tracker.controller';
import { HospitalTrackerService } from './hospital-tracker.service';

@Module({
  imports: [ConfigModule],
  controllers: [HospitalTrackerController],
  providers: [HospitalTrackerService],
  exports: [HospitalTrackerService],
})
export class HospitalTrackerModule {}
