import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { RiskEngineModule } from './risk-engine/risk-engine.module';
import { MobileAuthModule } from './mobile-auth/mobile-auth.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    FirebaseModule, // Global Firebase connection
    AuthModule,     // Security guards
    UserModule,     // Doctor registration/profiles
    PatientModule,  // Patient CRUD
    TelemetryModule, RiskEngineModule, MobileAuthModule, NotificationsModule // Vitals history
  ],
})
export class AppModule {}