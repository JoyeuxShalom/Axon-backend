import { Module } from '@nestjs/common';
import { FirebaseAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class AuthModule {}