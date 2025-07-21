export interface IPGeoLocationData {
  ip: string;
  hostname?: string;
  postal?: string;
  city_name?: string;
  region_code?: string;
  region_name?: string;
  country_code?: string;
  country_name?: string;
  continent_code?: string;
  continent_name?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  as?: string;
  isp?: string;
  user_agent?: string;
  isEU?: boolean;
}
