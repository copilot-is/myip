import { baiduQuery } from '@/lib/baidu';
import { geocnQuery } from '@/lib/geocn';
import { maxmindQuery } from '@/lib/maxmind';
import { meituanQuery } from '@/lib/meituan';
import { qqwryQuery } from '@/lib/qqwry';
import { IPGeoLocationData } from '@/lib/types';
import { getHostnames, isLocalhost } from '@/lib/utils';

export const IPLookup = async (
  ip: string,
  ua?: string,
  lang?: string,
  source = 'geocn' as IPGeoLocationData['source']
): Promise<IPGeoLocationData | undefined> => {
  let ipAddress = ip;
  if (isLocalhost(ip)) {
    ipAddress = '8.8.8.8';
  }

  let data = maxmindQuery(ipAddress, ua, lang);

  if (data) {
    const hostnames = await getHostnames(ip);
    if (hostnames.length) {
      data.hostname = hostnames.join(', ');
    }

    if (
      source === 'geocn' &&
      data.country_code === 'CN' &&
      data.registered_region_code === 'CN'
    ) {
      const geocnData = geocnQuery(ipAddress, lang);
      if (geocnData) {
        data = { ...data, ...geocnData };
      }
    }

    if (
      source === 'qqwry' &&
      data.country_code === 'CN' &&
      data.registered_region_code === 'CN'
    ) {
      const qqwryData = qqwryQuery(ipAddress);
      if (qqwryData) {
        data = { ...data, ...qqwryData };
      }
    }

    if (source === 'baidu') {
      const baiduData = await baiduQuery(ipAddress);
      if (baiduData) {
        data = { ...data, ...baiduData };
      }
    }

    if (source === 'meituan') {
      const meituanData = await meituanQuery(ipAddress);
      if (meituanData) {
        data = { ...data, ...meituanData };
      }
    }
  }

  return data;
};
