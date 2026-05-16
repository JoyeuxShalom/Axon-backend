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
exports.SpecialistsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
let SpecialistsService = class SpecialistsService {
    constructor(firebase) {
        this.firebase = firebase;
        this.collection = 'specialists';
    }
    async listSpecialists(category, search) {
        const db = this.firebase.getFirestore();
        let query = db.collection(this.collection);
        if (category) {
            query = query.where('category', '==', category.toLowerCase());
        }
        const snapshot = await query.get();
        let specialists = [];
        snapshot.forEach(doc => specialists.push({ id: doc.id, ...doc.data() }));
        if (search) {
            const searchLower = search.toLowerCase();
            specialists = specialists.filter(s => s.name?.toLowerCase().includes(searchLower) ||
                s.specialty?.toLowerCase().includes(searchLower));
        }
        return specialists;
    }
    async getSpecialistById(id) {
        const db = this.firebase.getFirestore();
        const doc = await db.collection(this.collection).doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Specialist with ID ${id} not found`);
        }
        return { id: doc.id, ...doc.data() };
    }
    async createSpecialist(dto) {
        const db = this.firebase.getFirestore();
        const docRef = await db.collection(this.collection).add({
            ...dto,
            category: dto.category.toLowerCase(),
            createdAt: new Date(),
        });
        return { id: docRef.id, message: 'Specialist added successfully' };
    }
    async updateSpecialist(id, dto) {
        const db = this.firebase.getFirestore();
        const docRef = db.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Specialist with ID ${id} not found`);
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.specialty !== undefined)
            updateData.specialty = dto.specialty;
        if (dto.category !== undefined)
            updateData.category = dto.category.toLowerCase();
        if (dto.rating !== undefined)
            updateData.rating = dto.rating;
        if (dto.reviews !== undefined)
            updateData.reviews = dto.reviews;
        if (dto.experience !== undefined)
            updateData.experience = dto.experience;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.hospital !== undefined)
            updateData.hospital = dto.hospital;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        updateData.updatedAt = new Date();
        await docRef.update(updateData);
        return { id, message: 'Specialist updated successfully' };
    }
    async deleteSpecialist(id) {
        const db = this.firebase.getFirestore();
        const docRef = db.collection(this.collection).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Specialist with ID ${id} not found`);
        }
        await docRef.delete();
        return { message: 'Specialist deleted successfully' };
    }
    async seedDefaults() {
        const db = this.firebase.getFirestore();
        const existing = await db.collection(this.collection).limit(1).get();
        if (!existing.empty) {
            return { message: 'Specialists collection already has data. Skipping seed.' };
        }
        const defaultSpecialists = [
            {
                name: 'Dr. Sarah Jenkins',
                specialty: 'Stroke Specialist',
                category: 'neurologist',
                rating: '4.9',
                reviews: '120',
                experience: '12 yrs exp',
                description: 'Specializes in hypertension management and stroke prevention.',
                hospital: 'Mount Sinai Hospital',
                phone: '+1 (555) 019-8372',
            },
            {
                name: 'Dr. Michael Chen',
                specialty: 'Neurorehabilitation',
                category: 'neurologist',
                rating: '4.8',
                reviews: '85',
                experience: '8 yrs exp',
                description: 'Leading researcher in cardiovascular health and recovery.',
                hospital: 'NYU Langone Health',
                phone: '+1 (555) 332-7191',
            },
            {
                name: 'Dr. Elena Rodriguez',
                specialty: 'Vascular Neurology',
                category: 'neurologist',
                rating: '5.0',
                reviews: '210',
                experience: '15 yrs exp',
                description: 'Expert in cardiac electrophysiology and rhythm disorders.',
                hospital: 'Columbia University Medical Center',
                phone: '+1 (555) 887-4200',
            },
            {
                name: 'Dr. James Wilson',
                specialty: 'Stroke Specialist',
                category: 'neurologist',
                rating: '4.7',
                reviews: '84',
                experience: '10 yrs exp',
                description: 'Specialist in cognitive neurology and stroke recovery.',
                hospital: 'Weill Cornell Medicine',
                phone: '+1 (555) 441-0099',
            },
            {
                name: 'Dr. Sarah Jenkins',
                specialty: 'Preventive Cardiology',
                category: 'cardiologist',
                rating: '4.9',
                reviews: '120',
                experience: '12 yrs exp',
                description: 'Specializes in hypertension management and stroke prevention.',
                hospital: 'Mount Sinai Hospital',
                phone: '+1 (555) 019-8372',
            },
            {
                name: 'Dr. Michael Chen',
                specialty: 'Heart Failure Specialist',
                category: 'cardiologist',
                rating: '4.8',
                reviews: '85',
                experience: '15 yrs exp',
                description: 'Leading researcher in cardiovascular health and recovery.',
                hospital: 'NYU Langone Health',
                phone: '+1 (555) 332-7191',
            },
            {
                name: 'Dr. Elena Rodriguez',
                specialty: 'Arrhythmia Expert',
                category: 'cardiologist',
                rating: '5.0',
                reviews: '42',
                experience: '8 yrs exp',
                description: 'Expert in cardiac electrophysiology and rhythm disorders.',
                hospital: 'Columbia University Medical Center',
                phone: '+1 (555) 887-4200',
            },
        ];
        const batch = db.batch();
        for (const specialist of defaultSpecialists) {
            const docRef = db.collection(this.collection).doc();
            batch.set(docRef, { ...specialist, createdAt: new Date() });
        }
        await batch.commit();
        return { message: `Seeded ${defaultSpecialists.length} specialists successfully` };
    }
};
exports.SpecialistsService = SpecialistsService;
exports.SpecialistsService = SpecialistsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], SpecialistsService);
//# sourceMappingURL=specialists.service.js.map