import { Module } from '@nestjs/common';
import { RiskEngineService } from './risk-engine.service';

@Module({
  providers: [RiskEngineService],
  exports: [RiskEngineService], // Expose it!
})
export class RiskEngineModule {}