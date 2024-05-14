export interface IPGeoLocationData {
  ip: string;
  hostname?: string;
  city?: string;
  postal?: string;
  regionCode?: string;
  regionName?: string;
  countryCode?: string;
  countryName?: string;
  continentCode?: string;
  continentName?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  as?: string;
  userAgent?: string;
}
