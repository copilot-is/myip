import { createHash } from 'crypto';

import { DEFAULT_EXPIRES_MS, getJSON, setJSON } from '@/lib/cache';
import { GEOLOCATION_MAP } from '@/lib/format';
import {
  IPGeoLocationData,
  MeituanIPResponse,
  MeituanLocationResponse
} from '@/lib/types';
import { pruneObject } from '@/lib/utils';

export const meituanQuery = async (
  ip: string
): Promise<IPGeoLocationData | undefined> => {
  try {
    const cacheHash = createHash('md5').update(ip).digest('hex');
    const cacheKey = `myip:meituan:${cacheHash}`;
    const cached = await getJSON<IPGeoLocationData>(cacheKey);
    if (
      cached &&
      cached.updatedAt &&
      Date.now() - cached.updatedAt < DEFAULT_EXPIRES_MS
    ) {
      return cached;
    }

    const mtResponse = await getMeituanLocationByIP(ip);
    if (mtResponse) {
      const mtCityResponse = await getMeituanCityByLatLng(
        mtResponse.lat,
        mtResponse.lng
      );
      if (mtCityResponse) {
        const regionName = mtCityResponse.province.replace('省', '');
        const cityName = mtCityResponse.city.replace('市', '');
        const data: IPGeoLocationData = {
          ip,
          country_name: mtCityResponse.country,
          region_name: regionName,
          city_name: cityName,
          district_name: mtCityResponse.district,
          area_name: mtCityResponse.areaName,
          address: mtCityResponse.detail,
          latitude: mtCityResponse.lat,
          longitude: mtCityResponse.lng,
          updatedAt: new Date().getTime(),
          source: 'meituan'
        };

        if (mtCityResponse.country === '中国') {
          data.country_code = 'CN';
        }

        if (mtResponse.rgeo.adcode) {
          data.region_code = mtResponse.rgeo.adcode?.slice(0, 2);
          data.city_code = mtCityResponse.district.includes(mtCityResponse.city)
            ? mtResponse.rgeo.adcode
            : mtResponse.rgeo.adcode?.slice(0, 4);
          data.district_code = mtResponse.rgeo.adcode;
        }

        const geolocation = GEOLOCATION_MAP[regionName]?.[cityName];
        if (geolocation) {
          data.postal = geolocation.postal;
        }

        const cachedData = pruneObject(data);

        await setJSON(cacheKey, cachedData);

        return cachedData;
      }
    }

    return cached;
  } catch (err) {
    console.error(err);
  }
};

const getMeituanLocationByIP = async (
  ip: string
): Promise<MeituanIPResponse['data'] | undefined> => {
  if (!ip) return;

  try {
    const url = new URL('https://apimobile.meituan.com/locate/v2/ip/loc');
    url.searchParams.set('rgeo', 'true');
    url.searchParams.set('ip', ip);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Accept: 'application/json',
        Referer: 'https://www.meituan.com',
        Origin: 'https://www.meituan.com'
      }
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const result: MeituanIPResponse = await res.json();
    if (result && result.data) {
      return result.data;
    } else {
      throw new Error(JSON.stringify(result.error));
    }
  } catch (err) {
    console.error(err);
  }
};

const getMeituanCityByLatLng = async (
  lat: number,
  lng: number
): Promise<MeituanLocationResponse['data'] | undefined> => {
  try {
    const url = new URL(
      `https://apimobile.meituan.com/group/v1/city/latlng/${lat},${lng}`
    );
    url.searchParams.set('tag', '0');

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Accept: 'application/json',
        Referer: 'https://www.meituan.com',
        Origin: 'https://www.meituan.com'
      }
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const result: MeituanLocationResponse = await res.json();
    if (result && result.data) {
      return result.data;
    } else {
      throw new Error(JSON.stringify(result.error));
    }
  } catch (err) {
    console.error(err);
  }
};
