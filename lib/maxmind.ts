import path from 'path';
import maxmind, { AsnResponse, CityResponse } from 'maxmind';

import { IPGeoLocationData } from '@/lib/types';
import { getHostnames } from '@/lib/utils';

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
  ip: string,
  ua?: string | null,
  lang?: string | null
): Promise<IPGeoLocationData | null> => {
  const hostnames = await getHostnames(ip);

  const asn = await maxmind.open<AsnResponse>(
    path.join(process.cwd(), '/db/GeoLite2-ASN.mmdb')
  );
  const asnResponse = asn.get(ip);

  const city = await maxmind.open<CityResponse>(
    path.join(process.cwd(), '/db/GeoLite2-City.mmdb')
  );
  const cityResponse = city.get(ip);

  let regionCode = cityResponse?.subdivisions?.[0]?.iso_code || '';
  let regionName = getNameByLang(cityResponse?.subdivisions?.[0]?.names, lang);
  let countryCode = cityResponse?.country?.iso_code || '';
  let countryName = getNameByLang(cityResponse?.country?.names, lang);

  if (['HK', 'MO', 'TW'].includes(countryCode.toUpperCase())) {
    regionCode = countryCode;
    regionName = countryName;
    countryName = getNameByLang(CHINA.names, lang);
  }

  return {
    ip: ip,
    hostname: hostnames.join(', '),
    city: getNameByLang(cityResponse?.city?.names, lang),
    postal: cityResponse?.postal?.code,
    regionCode,
    regionName,
    countryCode,
    countryName,
    continentCode: cityResponse?.continent?.code,
    continentName: getNameByLang(cityResponse?.continent?.names, lang),
    latitude: cityResponse?.location?.latitude,
    longitude: cityResponse?.location?.longitude,
    timezone: cityResponse?.location?.time_zone,
    as: (
      (asnResponse?.autonomous_system_number
        ? `AS${asnResponse?.autonomous_system_number} `
        : '') + (asnResponse?.autonomous_system_organization || '')
    ).trim(),
    isEU: cityResponse?.country?.is_in_european_union,
    userAgent: ua ?? ''
  } as IPGeoLocationData;
};

export default { get };
