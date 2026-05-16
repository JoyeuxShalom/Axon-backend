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
exports.HospitalTrackerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let HospitalTrackerService = class HospitalTrackerService {
    constructor(configService) {
        this.configService = configService;
        this.placesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
        this.apiKey = this.configService.get('GOOGLE_PLACES_API_KEY');
        if (!this.apiKey) {
            console.warn('⚠️  GOOGLE_PLACES_API_KEY not set — Hospital Tracker will use fallback data');
        }
    }
    async searchNearby(lat, lng, radius = 5000, keyword) {
        if (!this.apiKey) {
            return this.getFallbackHospitals(lat, lng);
        }
        try {
            const searchKeyword = keyword || 'stroke center hospital neurology';
            const url = `${this.placesBaseUrl}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&keyword=${encodeURIComponent(searchKeyword)}&key=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
                console.error('Google Places API error:', data.status, data.error_message);
                return this.getFallbackHospitals(lat, lng);
            }
            if (!data.results || data.results.length === 0) {
                return [];
            }
            return data.results.map((place) => {
                const distance = this.calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
                const driveTime = this.estimateDriveTime(distance);
                return {
                    placeId: place.place_id,
                    name: place.name,
                    address: place.vicinity || place.formatted_address || '',
                    distance: `${distance.toFixed(1)} miles away`,
                    distanceMiles: parseFloat(distance.toFixed(1)),
                    driveTime: `${driveTime} mins drive`,
                    driveTimeMinutes: driveTime,
                    rating: place.rating || null,
                    totalRatings: place.user_ratings_total || 0,
                    isOpen: place.opening_hours?.open_now ?? null,
                    types: place.types || [],
                    description: this.buildDescription(place),
                    location: {
                        lat: place.geometry.location.lat,
                        lng: place.geometry.location.lng,
                    },
                };
            })
                .sort((a, b) => a.distanceMiles - b.distanceMiles);
        }
        catch (error) {
            console.error('Failed to fetch from Google Places:', error);
            return this.getFallbackHospitals(lat, lng);
        }
    }
    async getDetails(placeId) {
        if (!this.apiKey) {
            return this.getFallbackDetail(placeId);
        }
        try {
            const fields = 'place_id,name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry,types,url';
            const url = `${this.placesBaseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.status !== 'OK') {
                throw new common_1.NotFoundException(`Hospital with place ID ${placeId} not found`);
            }
            const place = data.result;
            return {
                placeId: place.place_id,
                name: place.name,
                address: place.formatted_address || '',
                phone: place.formatted_phone_number || null,
                website: place.website || null,
                googleMapsUrl: place.url || null,
                rating: place.rating || null,
                totalRatings: place.user_ratings_total || 0,
                isOpen: place.opening_hours?.open_now ?? null,
                hours: place.opening_hours?.weekday_text || [],
                types: place.types || [],
                location: place.geometry ? {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                } : null,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            console.error('Failed to fetch place details:', error);
            throw new common_1.NotFoundException(`Could not retrieve details for place ID ${placeId}`);
        }
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 3958.8;
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
    estimateDriveTime(distanceMiles) {
        return Math.max(1, Math.round(distanceMiles * 2.5));
    }
    buildDescription(place) {
        const features = [];
        if (place.types?.includes('hospital'))
            features.push('Hospital');
        if (place.types?.includes('health'))
            features.push('Health Center');
        if (place.opening_hours?.open_now)
            features.push('Open Now');
        if (place.rating && place.rating >= 4.5)
            features.push('Highly Rated');
        if (place.user_ratings_total > 100)
            features.push(`${place.user_ratings_total} reviews`);
        return features.join(' • ') || 'Medical Facility';
    }
    getFallbackHospitals(lat, lng) {
        return [
            {
                placeId: 'fallback_mount_sinai',
                name: 'Mount Sinai Hospital',
                address: '1468 Madison Ave, New York, NY 10029',
                distance: '0.8 miles away',
                distanceMiles: 0.8,
                driveTime: '5 mins drive',
                driveTimeMinutes: 5,
                rating: 4.2,
                totalRatings: 3200,
                isOpen: true,
                types: ['hospital', 'health'],
                description: '24/7 Stroke Unit • JCI Accredited',
                location: { lat: lat + 0.008, lng: lng + 0.003 },
            },
            {
                placeId: 'fallback_nyc_health',
                name: 'NYC Health + Hospitals',
                address: '462 First Avenue, New York, NY 10016',
                distance: '1.2 miles away',
                distanceMiles: 1.2,
                driveTime: '8 mins drive',
                driveTimeMinutes: 8,
                rating: 3.8,
                totalRatings: 1500,
                isOpen: true,
                types: ['hospital', 'health'],
                description: 'Universal Care • Public Service',
                location: { lat: lat - 0.005, lng: lng + 0.010 },
            },
            {
                placeId: 'fallback_lenox_hill',
                name: 'Lenox Hill Hospital',
                address: '100 E 77th St, New York, NY 10075',
                distance: '2.4 miles away',
                distanceMiles: 2.4,
                driveTime: '15 mins drive',
                driveTimeMinutes: 15,
                rating: 4.0,
                totalRatings: 2100,
                isOpen: true,
                types: ['hospital', 'health'],
                description: 'Specialized Neurology Dept.',
                location: { lat: lat + 0.015, lng: lng - 0.008 },
            },
        ];
    }
    getFallbackDetail(placeId) {
        const fallbackMap = {
            fallback_mount_sinai: {
                placeId: 'fallback_mount_sinai',
                name: 'Mount Sinai Hospital',
                address: '1468 Madison Ave, New York, NY 10029',
                phone: '+1 (212) 241-6500',
                website: 'https://www.mountsinai.org',
                googleMapsUrl: 'https://maps.google.com/?q=Mount+Sinai+Hospital',
                rating: 4.2,
                totalRatings: 3200,
                isOpen: true,
                hours: [
                    'Monday: Open 24 hours', 'Tuesday: Open 24 hours',
                    'Wednesday: Open 24 hours', 'Thursday: Open 24 hours',
                    'Friday: Open 24 hours', 'Saturday: Open 24 hours',
                    'Sunday: Open 24 hours',
                ],
                types: ['hospital', 'health'],
                location: { lat: 40.7900, lng: -73.9526 },
            },
            fallback_nyc_health: {
                placeId: 'fallback_nyc_health',
                name: 'NYC Health + Hospitals',
                address: '462 First Avenue, New York, NY 10016',
                phone: '+1 (212) 562-4141',
                website: 'https://www.nychealthandhospitals.org',
                googleMapsUrl: 'https://maps.google.com/?q=NYC+Health+Hospitals',
                rating: 3.8,
                totalRatings: 1500,
                isOpen: true,
                hours: [
                    'Monday: Open 24 hours', 'Tuesday: Open 24 hours',
                    'Wednesday: Open 24 hours', 'Thursday: Open 24 hours',
                    'Friday: Open 24 hours', 'Saturday: Open 24 hours',
                    'Sunday: Open 24 hours',
                ],
                types: ['hospital', 'health'],
                location: { lat: 40.7394, lng: -73.9741 },
            },
            fallback_lenox_hill: {
                placeId: 'fallback_lenox_hill',
                name: 'Lenox Hill Hospital',
                address: '100 E 77th St, New York, NY 10075',
                phone: '+1 (212) 434-2000',
                website: 'https://www.northwell.edu/lenox-hill-hospital',
                googleMapsUrl: 'https://maps.google.com/?q=Lenox+Hill+Hospital',
                rating: 4.0,
                totalRatings: 2100,
                isOpen: true,
                hours: [
                    'Monday: Open 24 hours', 'Tuesday: Open 24 hours',
                    'Wednesday: Open 24 hours', 'Thursday: Open 24 hours',
                    'Friday: Open 24 hours', 'Saturday: Open 24 hours',
                    'Sunday: Open 24 hours',
                ],
                types: ['hospital', 'health'],
                location: { lat: 40.7738, lng: -73.9600 },
            },
        };
        const detail = fallbackMap[placeId];
        if (!detail) {
            throw new common_1.NotFoundException(`Hospital with place ID ${placeId} not found`);
        }
        return detail;
    }
};
exports.HospitalTrackerService = HospitalTrackerService;
exports.HospitalTrackerService = HospitalTrackerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HospitalTrackerService);
//# sourceMappingURL=hospital-tracker.service.js.map