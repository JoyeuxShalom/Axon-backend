import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Makes Firebase available everywhere without re-importing
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}