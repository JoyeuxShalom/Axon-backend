"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSpecialistDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSpecialistDto {
}
exports.CreateSpecialistDto = CreateSpecialistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dr. Sarah Jenkins' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Stroke Specialist' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'neurologist', enum: ['neurologist', 'cardiologist'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '4.9' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '120' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "reviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12 yrs exp' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Specializes in hypertension management and stroke prevention.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mount Sinai Hospital' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "hospital", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+1 (555) 019-8372' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "phone", void 0);
//# sourceMappingURL=create-specialist.dto.js.map