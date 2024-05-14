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

const get = async (
  ip?: string | null,
  userAgent?: string | null,
  lang: keyof {
    readonly de?: string;
    readonly en: string;
    readonly es?: string;
    readonly fr?: string;
    readonly ja?: string;
    readonly 'pt-BR'?: string;
    readonly ru?: string;
    readonly 'zh-CN'?: string;
  } = 'en'
): Promise<IPGeoLocationData | null> => {
  if (!ip || isLocalhost(ip) || process.env.NODE_ENV === 'development') {
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
    city: cityResponse?.city?.names[lang],
    postal: cityResponse?.postal?.code,
    regionCode: cityResponse?.subdivisions?.[0]?.iso_code ?? '',
    regionName: cityResponse?.subdivisions?.[0]?.names[lang] ?? '',
    countryCode: cityResponse?.country?.iso_code,
    countryName: cityResponse?.country?.names[lang],
    continentCode: cityResponse?.continent?.code,
    continentName: cityResponse?.continent?.names[lang],
    latitude: cityResponse?.location?.latitude,
    longitude: cityResponse?.location?.longitude,
    timezone: cityResponse?.location?.time_zone,
    as: `AS${asnResponse?.autonomous_system_number} ${asnResponse?.autonomous_system_organization}`,
    userAgent: userAgent ?? '',
  };

  return data;
};

export default { get };
