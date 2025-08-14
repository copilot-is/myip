export interface IPGeoLocationData {
  ip: string;
  hostname?: string;
  postal?: string;
  area_name?: string;
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
  address?: string;
  timezone?: string;
  isp?: string;
  asn?: number;
  org?: string;
  user_agent?: string;
  isEU?: boolean;
  source: 'maxmind' | 'geocn' | 'qqwry' | 'baidu' | 'meituan';
  updatedAt?: number;
}

export interface ChinaResponse {
  isp?: string;
  net?: string;
  province?: string;
  provinceCode?: number;
  city?: string;
  cityCode?: number;
  districts?: string;
  districtsCode?: number;
  readonly autonomous_system_number: number;
  readonly autonomous_system_organization: string;
}

export interface BaiduBCEResponse {
  code: string;
  ip: string;
  data: {
    continent: string;
    country: string;
    zipcode: string;
    owner: string;
    isp: string;
    adcode?: string;
    prov: string;
    city: string;
    district?: string;
  };
}

export interface MeituanIPResponse {
  error?: { code: number; domain: string; message: string };
  data?: {
    lng: number;
    fromwhere: string;
    ip: string;
    rgeo: {
      country: string;
      province: string;
      adcode?: string;
      city: string;
      district?: string;
    };
    lat: number;
  };
}

export interface MeituanLocationResponse {
  error?: { code: number; domain: string; message: string };
  data?: {
    area: number;
    country: string;
    lng: number;
    cityPinyin: string;
    city: string;
    isForeign: boolean;
    originCityID: number;
    dpCityId: number;
    openCityName: string;
    isOpen: boolean;
    province: string;
    areaName: string;
    parentArea: number;
    district: string;
    id: number;
    detail: string;
    lat: number;
  };
}
