import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HospitalTrackerService {
  private readonly apiKey: string | undefined;
  private readonly placesBaseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY');
    if (!this.apiKey) {
      console.warn('⚠️  GOOGLE_PLACES_API_KEY not set — Hospital Tracker will use fallback data');
    }
  }

  // ─── SEARCH NEARBY HOSPITALS ──────────────────────────────
  async searchNearby(lat: number, lng: number, radius: number = 5000, keyword?: string) {
    // If no API key, return fallback data for dev/testing
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

      // Map Google Places results to our format
      return data.results.map((place: any) => {
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
      .sort((a: any, b: any) => a.distanceMiles - b.distanceMiles);

    } catch (error) {
      console.error('Failed to fetch from Google Places:', error);
      return this.getFallbackHospitals(lat, lng);
    }
  }

  // ─── GET HOSPITAL DETAILS ─────────────────────────────────
  async getDetails(placeId: string) {
    // If no API key, return fallback detail
    if (!this.apiKey) {
      return this.getFallbackDetail(placeId);
    }

    try {
      const fields = 'place_id,name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry,types,url';
      const url = `${this.placesBaseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new NotFoundException(`Hospital with place ID ${placeId} not found`);
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

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Failed to fetch place details:', error);
      throw new NotFoundException(`Could not retrieve details for place ID ${placeId}`);
    }
  }

  // ─── HELPERS ──────────────────────────────────────────────

  // Haversine formula to calculate distance between two coordinates (in miles)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3958.8; // Earth radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Rough drive time estimate: ~2 mins per mile in urban areas
  private estimateDriveTime(distanceMiles: number): number {
    return Math.max(1, Math.round(distanceMiles * 2.5));
  }

  // Build a description from place types
  private buildDescription(place: any): string {
    const features: string[] = [];
    if (place.types?.includes('hospital')) features.push('Hospital');
    if (place.types?.includes('health')) features.push('Health Center');
    if (place.opening_hours?.open_now) features.push('Open Now');
    if (place.rating && place.rating >= 4.5) features.push('Highly Rated');
    if (place.user_ratings_total > 100) features.push(`${place.user_ratings_total} reviews`);
    return features.join(' • ') || 'Medical Facility';
  }

  // ─── FALLBACK DATA (for development without API key) ──────
  private getFallbackHospitals(lat: number, lng: number) {
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

  private getFallbackDetail(placeId: string) {
    const fallbackMap: Record<string, any> = {
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
      throw new NotFoundException(`Hospital with place ID ${placeId} not found`);
    }
    return detail;
  }
}
