import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterMobilePatientDto } from './dto/register-mobile.dto';
import { LoginMobileDto } from './dto/login-mobile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MobileAuthService {
  constructor(
    private firebase: FirebaseService,
    private mailService: MailService,
  ) {}

  async registerPatient(dto: RegisterMobilePatientDto) {
    const auth = this.firebase.getAuth();
    const db = this.firebase.getFirestore();

    try {
      // 1. Check if user already exists (optional check, auth.createUser also throws)
      try {
        await auth.getUserByEmail(dto.email);
        throw new BadRequestException('This email is already registered. Please sign in instead.');
      } catch (e: any) {
        if (e.status === 400) throw e; // Re-throw our own exception
        // If it's auth/user-not-found, we continue
      }

      // 2. Create the user in Firebase Authentication
      const userRecord = await auth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.fullName,
      });

      // 3. Create their profile in the Firestore 'Users' collection
      await db.collection('Users').doc(userRecord.uid).set({
        email: dto.email,
        name: dto.fullName,
        deviceId: dto.deviceId,
        role: 'patient',
        createdAt: new Date(),
      });

      // 4. Send Welcome Email Notification
      try {
        await this.mailService.sendMail(
          dto.email,
          'Welcome to Axon Medical!',
          'welcome', // refers to templates/welcome.hbs
          { name: dto.fullName, email: dto.email }
        );
      } catch (mailError) {
        console.error('Failed to send welcome email:', mailError);
        // We don't throw here to avoid failing registration if email service is down
      }

      return { 
        message: 'Patient registered successfully', 
        uid: userRecord.uid 
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        throw new BadRequestException('This email is already registered. Please sign in instead.');
      }
      throw new BadRequestException(error.message || 'Failed to register patient');
    }
  }

  // ─── LOGIN (Verify credentials & return user data) ─────────
  async loginPatient(dto: LoginMobileDto) {
    try {
      const auth = this.firebase.getAuth();
      const db = this.firebase.getFirestore();

      // 1. Look up the user by email to verify they exist
      const userRecord = await auth.getUserByEmail(dto.email);

      // 2. Create a custom token so the mobile app can sign in client-side
      const customToken = await auth.createCustomToken(userRecord.uid);

      // 3. Fetch their Firestore profile
      const profileDoc = await db.collection('Users').doc(userRecord.uid).get();
      const profile = profileDoc.exists ? profileDoc.data() : null;

      return {
        message: 'Login successful',
        uid: userRecord.uid,
        customToken,
        profile: profile ? { ...profile, uid: userRecord.uid } : null,
      };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new UnauthorizedException('No account found with this email address');
      }
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }

  // ─── FORGOT PASSWORD ──────────────────────────────────────
  async forgotPassword(email: string) {
    try {
      const auth = this.firebase.getAuth();

      // Verify the user exists first
      await auth.getUserByEmail(email);

      // Generate a password reset link
      const resetLink = await auth.generatePasswordResetLink(email);

      // Send the email using the new dynamic service
      await this.mailService.sendMail(
        email,
        'Reset Your Axon Password',
        'password-reset', // refers to templates/password-reset.hbs
        { resetLink },
      );

      console.log(`Password reset email sent to ${email}`);

      return {
        message: 'Password reset email sent successfully. Please check your inbox.',
      };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Don't reveal whether email exists (security best practice)
        return { message: 'If this email is registered, a reset link has been sent.' };
      }
      throw new BadRequestException(error.message || 'Failed to send password reset email');
    }
  }

  // ─── GET PROFILE ───────────────────────────────────────────
  async getProfile(uid: string) {
    const db = this.firebase.getFirestore();
    const doc = await db.collection('Users').doc(uid).get();

    if (!doc.exists) {
      throw new NotFoundException('Patient profile not found');
    }

    return { uid: doc.id, ...doc.data() };
  }

  // ─── UPDATE PROFILE ────────────────────────────────────────
  async updateProfile(uid: string, dto: UpdateProfileDto) {
    try {
      const db = this.firebase.getFirestore();
      const auth = this.firebase.getAuth();

      // Build update payload (only include non-undefined fields)
      const updateData: Record<string, any> = {};
      if (dto.fullName !== undefined) updateData.name = dto.fullName;
      if (dto.phone !== undefined) updateData.phone = dto.phone;
      if (dto.dateOfBirth !== undefined) updateData.dateOfBirth = dto.dateOfBirth;
      if (dto.gender !== undefined) updateData.gender = dto.gender;
      if (dto.bloodType !== undefined) updateData.bloodType = dto.bloodType;
      if (dto.address !== undefined) updateData.address = dto.address;
      if (dto.emergencyNote !== undefined) updateData.emergencyNote = dto.emergencyNote;
      updateData.updatedAt = new Date();

      // Update Firestore profile
      await db.collection('Users').doc(uid).set(updateData, { merge: true });

      // If name changed, also update Firebase Auth display name
      if (dto.fullName) {
        await auth.updateUser(uid, { displayName: dto.fullName });
      }

      return { message: 'Profile updated successfully' };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update profile');
    }
  }
}