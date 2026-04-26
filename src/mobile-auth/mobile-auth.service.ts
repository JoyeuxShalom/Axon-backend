import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';

@Injectable()
export class MobileAuthService {
  constructor(private firebase: FirebaseService) {}

  async registerPatient(dto: RegisterMobilePatientDto) {
    try {
      const auth = this.firebase.getAuth();
      const db = this.firebase.getFirestore();

      // 1. Create the user in Firebase Authentication
      const userRecord = await auth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.fullName,
      });

      // 2. Create their profile in the Firestore 'Users' collection
      await db.collection('Users').doc(userRecord.uid).set({
        email: dto.email,
        name: dto.fullName,
        deviceId: dto.deviceId,
        role: 'patient',
        createdAt: new Date(),
      });

      return { 
        message: 'Patient registered successfully', 
        uid: userRecord.uid 
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to register patient');
    }
  }
}