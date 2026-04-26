import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { RiskEngineModule } from '../risk-engine/risk-engine.module';
import { NotificationsModule } from '../notifications/notifications.module'; 

@Module({
  imports: [RiskEngineModule, NotificationsModule], 
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}