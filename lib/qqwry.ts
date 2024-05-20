import path from 'path';
import libqqwry from 'lib-qqwry';

import format from '@/lib/format';
import { IPGeoLocationData } from '@/lib/types';

const get = (ip: string): IPGeoLocationData => {
  const qqwry = libqqwry(true, path.join(process.cwd(), '/db/qqwry.dat'));
  const data = qqwry.searchIP(ip);
  const info = format(data.Country, data.Area);

  return {
    ip,
    city: info.city_name,
    postal: info.postal,
    regionName: info.region_name,
    countryName: info.country_name,
    isp: info.isp_domain,
    longitude: info.longitude ? parseFloat(info.longitude) : undefined,
    latitude: info.latitude ? parseFloat(info.latitude) : undefined,
  } as IPGeoLocationData;
};

export default { get };
