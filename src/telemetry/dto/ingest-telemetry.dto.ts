import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class IngestTelemetryDto {
  @IsString()
  @IsNotEmpty()
  device_id: string; // The ESP32 will send its ID (e.g., "AX-552-C")

  @IsNumber()
  spo2: number;

  @IsNumber()
  bpm: number;

  @IsNumber()
  systolic: number;

  @IsNumber()
  diastolic: number;

  @IsBoolean()
  fall_detected: boolean; // From the MPU6050

  @IsNumber()
  steps: number;

  @IsNumber()
  calories: number;
}