import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterDoctorDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(private firebase: FirebaseService) {}

  async registerDoctor(dto: RegisterDoctorDto, uid: string) {
    try {
      const db = this.firebase.getFirestore();
      
      // Create the doctor profile in Firestore
      await db.collection('doctors').doc(uid).set({
        email: dto.email,
        fullName: dto.fullName,
        credentials: dto.credentials,
        wardAssignment: dto.wardAssignment,
        role: 'physician',
        createdAt: new Date(),
      });

      return { message: 'Doctor profile created successfully', uid };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create doctor profile');
    }
  }

  async getDoctorProfile(uid: string) {
    const db = this.firebase.getFirestore();
    const doc = await db.collection('doctors').doc(uid).get();
    
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  }
}