import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsString()
  dob: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  @IsString()
  nhi: string;

  @IsString()
  ward: string;

  @IsString()
  wardCode: string;

  @IsString()
  risk: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsObject()
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}