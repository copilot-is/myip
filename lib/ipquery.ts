import isFQDN from 'validator/lib/isFQDN';
import isIP from 'validator/lib/isIP';

import maxmind from '@/lib/maxmind';
import qqwry from '@/lib/qqwry';
import { IPGeoLocationData } from '@/lib/types';
import { getDomainAddress, isLocalhost } from '@/lib/utils';

export const IPQuery = async (
  query?: string | null,
  ua?: string | null,
  lang?: string | null
): Promise<IPGeoLocationData | null> => {
  if (!query || (!isIP(query) && !isFQDN(query))) {
    return null;
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

  let geo1, geo2;

  geo1 = await maxmind.get(query, ua, lang);
  if (isIP(query, 4) && geo1?.countryCode?.toUpperCase() === 'CN') {
    geo2 = qqwry.get(query);
  }

  return { ...geo1, ...geo2 } as IPGeoLocationData;
};
