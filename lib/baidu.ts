import { createHash } from 'crypto';

import { DEFAULT_EXPIRES_MS, getJSON, setJSON } from '@/lib/cache';
import { GEOLOCATION_MAP } from '@/lib/format';
import { BaiduBCEResponse, IPGeoLocationData } from '@/lib/types';
import { pruneObject } from '@/lib/utils';

export const baiduQuery = async (
  ip: string
): Promise<IPGeoLocationData | undefined> => {
  try {
    const cacheHash = createHash('md5').update(ip).digest('hex');
    const cacheKey = `myip:baidu:${cacheHash}`;
    const cached = await getJSON<IPGeoLocationData>(cacheKey);
    if (
      cached &&
      cached.updatedAt &&
      Date.now() - cached.updatedAt < DEFAULT_EXPIRES_MS
    ) {
      return cached;
    }

    const baiduResponse = await getBaiduDistrictByIP(ip);
    if (
      baiduResponse &&
      baiduResponse.country &&
      baiduResponse.prov &&
      baiduResponse.city
    ) {
      const regionName = baiduResponse.prov.replace('省', '');
      const cityName = baiduResponse.city.replace('市', '');
      const data: IPGeoLocationData = {
        ip,
        country_name: baiduResponse.country,
        region_name: regionName,
        city_name: cityName,
        postal: baiduResponse.zipcode,
        district_name: baiduResponse.district,
        updatedAt: new Date().getTime(),
        source: 'baidu'
      };

      if (baiduResponse.country === '中国') {
        data.country_code = 'CN';
        data.isp = baiduResponse.isp;
      }

      if (baiduResponse.adcode) {
        data.region_code = baiduResponse.adcode.slice(0, 2);
        data.city_code =
          baiduResponse.district === baiduResponse.city
            ? baiduResponse.adcode
            : baiduResponse.adcode.slice(0, 4);
        data.district_code = baiduResponse.adcode;
      }

      const geolocation = GEOLOCATION_MAP[regionName]?.[cityName];
      if (geolocation) {
        data.latitude = geolocation.latitude;
        data.longitude = geolocation.longitude;
      }

      const cachedData = pruneObject(data);

      await setJSON(cacheKey, cachedData);

      return cachedData;
    }

    return cached;
  } catch (err) {
    console.error(err);
  }
};

const getBaiduDistrictByIP = async (
  ip: string
): Promise<BaiduBCEResponse['data'] | undefined> => {
  if (!ip) return;

  try {
    const url = new URL('https://qifu-api.baidubce.com/ip/geo/v1/district');
    url.searchParams.set('ip', ip);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Accept: 'application/json;charset=UTF-8',
        Referer: 'https://www.baidu.com',
        Origin: 'https://www.baidu.com'
      }
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const result: BaiduBCEResponse = await res.json();
    if (result && result.code.toLowerCase() === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(JSON.stringify(result.code));
    }
  } catch (error) {
    console.error(error);
  }
};
