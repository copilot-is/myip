export interface IPGeoLocationData {
  ip: string;
  hostname?: string;
  postal?: string;
  district_code?: string;
  district_name?: string;
  city_code?: string;
  city_name?: string;
  region_code?: string;
  region_name?: string;
  country_code?: string;
  country_name?: string;
  continent_code?: string;
  continent_name?: string;
  registered_region_code?: string;
  registered_region_name?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  asn?: number;
  org?: string;
  as?: string;
  user_agent?: string;
  isEU?: boolean;
}

export interface ChinaResponse {
  isp?: string;
  net?: string;
  province?: string;
  city?: string;
  districts?: string;
  provinceCode?: number;
  cityCode?: number;
  districtsCode?: number;
  autonomous_system_number: number;
  autonomous_system_organization: string;
}
