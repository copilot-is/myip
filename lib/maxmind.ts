import dns from 'dns';
import path from 'path';
import maxmind, { AsnResponse, CityResponse } from 'maxmind';

import { IPGeoLocationData } from '@/lib/types';
import { isLocalhost } from '@/lib/utils';

async function getHostnames(ip: string): Promise<string[]> {
  let hostnames: string[] = [];

  try {
    hostnames = await dns.promises.reverse(ip);
  } catch (error) {
    console.error('Error occurred:', error);
  }

  return hostnames;
}

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
  lang?: string | null
): string {
  switch (lang?.toLowerCase()) {
    case 'en':
      return names?.en || '';
    case 'de':
      return names?.de || names?.en || '';
    case 'es':
      return names?.es || names?.en || '';
    case 'fr':
      return names?.fr || names?.en || '';
    case 'ja':
      return names?.ja || names?.en || '';
    case 'pt-br':
      return names?.['pt-BR'] || names?.en || '';
    case 'ru':
      return names?.ru || names?.en || '';
    case 'zh-cn':
      return names?.['zh-CN'] || names?.en || '';
    default:
      return names?.en || '';
  }
}

const get = async (
  ip?: string | null,
  userAgent?: string | null,
  lang?: string | null
): Promise<IPGeoLocationData | null> => {
  if (!ip || isLocalhost(ip)) {
    ip = '8.8.8.8';
  }

  const hostnames = await getHostnames(ip);

  const asn = await maxmind.open<AsnResponse>(
    path.join(process.cwd(), '/db/GeoLite2-ASN.mmdb')
  );
  const asnResponse = asn.get(ip);

  const city = await maxmind.open<CityResponse>(
    path.join(process.cwd(), '/db/GeoLite2-City.mmdb')
  );
  const cityResponse = city.get(ip);

  const data: IPGeoLocationData = {
    ip: ip,
    hostname: hostnames.join(', '),
    city: getNameByLang(cityResponse?.city?.names, lang),
    postal: cityResponse?.postal?.code,
    regionCode: cityResponse?.subdivisions?.[0]?.iso_code ?? '',
    regionName: getNameByLang(cityResponse?.subdivisions?.[0]?.names, lang),
    countryCode: cityResponse?.country?.iso_code,
    countryName: getNameByLang(cityResponse?.country?.names, lang),
    continentCode: cityResponse?.continent?.code,
    continentName: getNameByLang(cityResponse?.continent?.names, lang),
    latitude: cityResponse?.location?.latitude,
    longitude: cityResponse?.location?.longitude,
    timezone: cityResponse?.location?.time_zone,
    as: `AS${asnResponse?.autonomous_system_number} ${asnResponse?.autonomous_system_organization}`.trim(),
    userAgent: userAgent ?? '',
  };

  return data;
};

export default { get };
