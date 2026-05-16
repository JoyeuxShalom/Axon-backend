import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { RiskEngineModule } from './risk-engine/risk-engine.module';
import { MobileAuthModule } from './mobile-auth/mobile-auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmergencyContactsModule } from './emergency-contacts/emergency-contacts.module';
import { SpecialistsModule } from './specialists/specialists.module';
import { HealthReportsModule } from './health-reports/health-reports.module';
import { HospitalTrackerModule } from './hospital-tracker/hospital-tracker.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env variables
    FirebaseModule,           // Global Firebase connection
    MailModule,               // Dynamic Email Service
    AuthModule,               // Security guards
    UserModule,               // Doctor registration/profiles
    PatientModule,            // Patient CRUD + device management
    TelemetryModule,          // Vitals history + alerts
    RiskEngineModule,         // Stroke risk analysis
    MobileAuthModule,         // Mobile app auth (register, login, profile)
    NotificationsModule,      // Push notifications + feed + preferences
    EmergencyContactsModule,  // Emergency contacts CRUD
    SpecialistsModule,        // Doctor/specialist directory + admin CRUD
    HealthReportsModule,      // Health report aggregation + trends + export
    HospitalTrackerModule,    // Nearby hospital search (Google Places API)
  ],
})
export class AppModule {}