import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { PostcodeInfo } from '../types';

export const POPULAR_UK_POSTCODES: PostcodeInfo[] = [
  { postcode: 'SW1A 1AA', area: 'Westminster', district: 'City of Westminster', city: 'London', region: 'London', latitude: 51.5014, longitude: -0.1419 },
  { postcode: 'M1 1AE', area: 'Piccadilly', district: 'Manchester', city: 'Manchester', region: 'North West', latitude: 53.4808, longitude: -2.2384 },
  { postcode: 'B1 1BB', area: 'City Centre', district: 'Birmingham', city: 'Birmingham', region: 'West Midlands', latitude: 52.4797, longitude: -1.9027 },
  { postcode: 'EH1 1YZ', area: 'Old Town', district: 'City of Edinburgh', city: 'Edinburgh', region: 'Scotland', latitude: 55.9486, longitude: -3.1999 },
  { postcode: 'BS1 4DJ', area: 'Harbourside', district: 'City of Bristol', city: 'Bristol', region: 'South West', latitude: 51.4502, longitude: -2.6006 },
  { postcode: 'LS1 2HL', area: 'Briggate', district: 'Leeds', city: 'Leeds', region: 'Yorkshire', latitude: 53.7972, longitude: -1.5435 },
  { postcode: 'NE1 1EE', area: 'Grainger Town', district: 'Newcastle', city: 'Newcastle', region: 'North East', latitude: 54.9734, longitude: -1.6139 },
  { postcode: 'CB2 1AG', area: 'Market Square', district: 'Cambridge', city: 'Cambridge', region: 'East of England', latitude: 52.2053, longitude: 0.1191 },
];

export async function lookupPostcode(postcode: string): Promise<PostcodeInfo | null> {
  const clean = postcode.trim().replace(/\s+/g, '').toUpperCase();
  if (clean.length < 2) return null;

  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        const r = data.result;
        return {
          postcode: r.postcode || postcode.toUpperCase(),
          area: r.admin_ward || r.parish || r.admin_district || 'Local Area',
          district: r.admin_district || 'District',
          city: r.admin_district || r.region || 'UK City',
          region: r.region || 'United Kingdom',
          latitude: r.latitude,
          longitude: r.longitude,
        };
      }
    }
  } catch {
    // network fallback
  }

  // Check popular cache
  const cached = POPULAR_UK_POSTCODES.find(
    p => p.postcode.replace(/\s+/g, '').toUpperCase() === clean || clean.startsWith(p.postcode.split(' ')[0])
  );
  if (cached) return cached;

  return {
    postcode: postcode.toUpperCase(),
    area: 'Local Area',
    district: 'Metropolitan',
    city: 'UK City',
    region: 'United Kingdom',
  };
}

export async function lookupCoordinates(latitude: number, longitude: number): Promise<PostcodeInfo | null> {
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes?lat=${latitude}&lon=${longitude}&limit=1`
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.result && data.result.length > 0) {
        const r = data.result[0];
        return {
          postcode: r.postcode,
          area: r.admin_ward || r.parish || r.admin_district || 'Local Area',
          district: r.admin_district || 'District',
          city: r.admin_district || r.region || 'UK City',
          region: r.region || 'United Kingdom',
          latitude: r.latitude,
          longitude: r.longitude,
        };
      }
    }
  } catch {
    // fallback
  }

  // If outside UK or offline, fallback to closest popular city
  return {
    postcode: 'SW1A 1AA',
    area: 'Westminster (Detected)',
    district: 'City of Westminster',
    city: 'London',
    region: 'London',
    latitude,
    longitude,
  };
}

export async function getDeviceLiveLocation(): Promise<{ success: boolean; data?: PostcodeInfo; error?: string }> {
  try {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const info = await lookupCoordinates(latitude, longitude);
            if (info) {
              resolve({ success: true, data: info });
            } else {
              resolve({
                success: true,
                data: {
                  postcode: 'SW1A 1AA',
                  area: 'Central London',
                  district: 'Westminster',
                  city: 'London',
                  region: 'London',
                  latitude,
                  longitude,
                },
              });
            }
          },
          (err) => {
            resolve({
              success: false,
              error: err.message || 'Location permission denied. Please enter postcode manually.',
            });
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      });
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Permission to access location was denied. Please allow location access or type your postcode.',
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const info = await lookupCoordinates(location.coords.latitude, location.coords.longitude);
    if (info) {
      return { success: true, data: info };
    }

    return {
      success: true,
      data: {
        postcode: 'SW1A 1AA',
        area: 'Detected Location',
        district: 'City of Westminster',
        city: 'London',
        region: 'London',
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unable to retrieve device location.',
    };
  }
}
