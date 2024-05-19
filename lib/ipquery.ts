import isIP from 'validator/lib/isIP';

import maxmind from '@/lib/maxmind';
import qqwry from '@/lib/qqwry';
import { IPGeoLocationData } from '@/lib/types';
import { isLocalhost } from '@/lib/utils';

export const IPQuery = async (
  ip?: string | null,
  ua?: string | null,
  lang?: string | null
): Promise<IPGeoLocationData | null> => {
  if (!ip || isLocalhost(ip)) {
    ip = '8.8.8.8';
  }

  let geo1, geo2;

  geo1 = await maxmind.get(ip, ua, lang);
  if (isIP(ip, 4) && geo1?.countryCode?.toUpperCase() === 'CN') {
    geo2 = qqwry.get(ip);
  }

  return { ...geo1, ...geo2 } as IPGeoLocationData;
};
