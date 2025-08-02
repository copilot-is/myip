import fs from 'fs';
import path from 'path';
import { AsnResponse, CityResponse, Reader } from 'maxmind';
import isFQDN from 'validator/lib/isFQDN';
import isIP from 'validator/lib/isIP';

import { ChinaResponse, IPGeoLocationData } from '@/lib/types';
import { getDomainAddress, getHostnames, isLocalhost } from '@/lib/utils';

import { GEOLOCATION } from './format';

const CHINA = {
  names: {
    de: 'China',
    en: 'China',
    es: 'China',
    fr: 'Chine',
    ja: '中国',
    'pt-BR': 'China',
    ru: 'Китай',
    'zh-CN': '中国'
  }
};

function getNameByLang(
  names?: {
    de?: string;
    en: string;
    es?: string;
    fr?: string;
    ja?: string;
    'pt-BR'?: string;
    ru?: string;
    'zh-CN'?: string;
  },
  lang?: string
): string | undefined {
  switch (lang?.toLowerCase()) {
    case 'en':
      return names?.en;
    case 'de':
      return names?.de || names?.en;
    case 'es':
      return names?.es || names?.en;
    case 'fr':
      return names?.fr || names?.en;
    case 'ja':
      return names?.ja || names?.en;
    case 'pt-br':
      return names?.['pt-BR'] || names?.en;
    case 'ru':
      return names?.ru || names?.en;
    case 'zh-cn':
      return names?.['zh-CN'] || names?.en;
    default:
      return names?.en;
  }
}

const asnBuffer = fs.readFileSync(
  path.join(process.cwd(), '/db/GeoLite2-ASN.mmdb')
);
const cityBuffer = fs.readFileSync(
  path.join(process.cwd(), '/db/GeoLite2-City.mmdb')
);
const cnBuffer = fs.readFileSync(path.join(process.cwd(), '/db/GeoCN.mmdb'));

const asnLookup = new Reader<AsnResponse>(asnBuffer);
const cityLookup = new Reader<CityResponse>(cityBuffer);
const cnLookup = new Reader<ChinaResponse>(cnBuffer);

export const IPLookup = async (
  query: string,
  ua?: string,
  lang?: string
): Promise<IPGeoLocationData | undefined> => {
  if (!query || (!isIP(query) && !isFQDN(query))) {
    return;
  }

  let ip = query;
  if (isLocalhost(query)) {
    ip = '8.8.8.8';
  }

  if (isFQDN(query)) {
    const address = await getDomainAddress(query);
    if (address) {
      ip = address;
    }
  }

  const hostnames = await getHostnames(ip);
  const asnResponse = asnLookup.get(ip);
  const cityResponse = cityLookup.get(ip);
  const cnResponse = cnLookup.get(ip);

  const data: IPGeoLocationData = {
    ip,
    hostname: hostnames.join(', '),
    postal: cityResponse?.postal?.code,
    city_code: cityResponse?.city?.geoname_id?.toString(),
    city_name: getNameByLang(cityResponse?.city?.names, lang),
    region_code: cityResponse?.subdivisions?.[0]?.iso_code,
    region_name: getNameByLang(cityResponse?.subdivisions?.[0]?.names, lang),
    country_code: cityResponse?.country?.iso_code,
    country_name: getNameByLang(cityResponse?.country?.names, lang),
    continent_code: cityResponse?.continent?.code,
    continent_name: getNameByLang(cityResponse?.continent?.names, lang),
    asn: asnResponse?.autonomous_system_number,
    org: asnResponse?.autonomous_system_organization,
    as: (
      (asnResponse?.autonomous_system_number
        ? `AS${asnResponse?.autonomous_system_number} `
        : '') + (asnResponse?.autonomous_system_organization || '')
    ).trim(),
    latitude: cityResponse?.location?.latitude,
    longitude: cityResponse?.location?.longitude,
    timezone: cityResponse?.location?.time_zone,
    isEU: cityResponse?.country?.is_in_european_union,
    user_agent: ua
  };

  if (['HK', 'MO', 'TW'].includes(cityResponse?.country?.iso_code || '')) {
    data.region_code = cityResponse?.country?.iso_code;
    data.region_name = getNameByLang(cityResponse?.country?.names, lang);
    data.country_code = 'CN';
    data.country_name = getNameByLang(CHINA.names, lang);
  }

  if (cityResponse?.country?.iso_code === 'CN' && cnResponse) {
    data.city_code = cnResponse?.cityCode?.toString();
    data.city_name = cnResponse?.city?.replace('市', '') || '';
    data.region_code = cnResponse?.provinceCode?.toString();
    data.region_name = cnResponse?.province?.replace('省', '') || '';
    data.country_name = getNameByLang(CHINA.names, 'zh-cn');
    data.isp = cnResponse?.isp;

    const geolocation = GEOLOCATION[data.region_name]?.[data.city_name];
    data.postal = geolocation.postal;
    data.latitude = geolocation.latitude;
    data.longitude = geolocation.longitude;
  }

  return data;
};
