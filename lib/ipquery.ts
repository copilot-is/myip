import isFQDN from 'validator/lib/isFQDN';
import isIP from 'validator/lib/isIP';

import maxmind from '@/lib/maxmind';
import qqwry from '@/lib/qqwry';
import { IPGeoLocationData } from '@/lib/types';
import { getDomainAddress, isLocalhost } from '@/lib/utils';

export const IPQuery = async (
  query?: string,
  ua?: string,
  lang?: string
): Promise<IPGeoLocationData | undefined> => {
  if (!query || (!isIP(query) && !isFQDN(query))) {
    return;
  }

  if (isLocalhost(query)) {
    query = '8.8.8.8';
  }

  if (isFQDN(query)) {
    const address = await getDomainAddress(query);
    if (address) {
      query = address;
    }
  }

  const geolocation = qqwry.get(query, ua);
  if (geolocation && geolocation.country_code?.toUpperCase() === 'CN') {
    return geolocation;
  } else {
    return await maxmind.get(query, ua, lang);
  }
};
