import path from 'path';
import IPDB from 'ipdb';

import { GEOLOCATION, ISP } from '@/lib/format';
import { IPGeoLocationData } from '@/lib/types';

const get = (ip: string, ua?: string): IPGeoLocationData | undefined => {
  const ipdb = new IPDB(path.join(process.cwd(), '/db/qqwry.ipdb'));
  const res = ipdb.find(ip);

  if (res && res.data) {
    const info = res.data;
    const isp = info.isp_domain ? ISP[info.isp_domain] : info.isp_domain;
    const geolocation =
      GEOLOCATION[info.country_name]?.[info.region_name]?.[info.city_name];

    return {
      ip,
      postal: geolocation ? geolocation.postal : undefined,
      city_name: info.city_name,
      region_name: info.region_name,
      country_code: info.country_code,
      country_name: info.country_name,
      continent_code: info.continent_code,
      continent_name: 'Asia',
      timezone: 'Asia/Shanghai',
      isp,
      latitude:
        geolocation && geolocation.latitude
          ? parseFloat(geolocation.latitude)
          : undefined,
      longitude:
        geolocation && geolocation.longitude
          ? parseFloat(geolocation.longitude)
          : undefined,
      user_agent: ua
    };
  }
};

export default { get };
