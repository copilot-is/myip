import { createHash } from 'crypto';

import { CHINA, getNameByLang } from '@/lib/lang';
import { IPAPIResponse, IPGeoLocationData } from '@/lib/types';
import { parseASNData, pruneObject } from '@/lib/utils';

import { DEFAULT_EXPIRES_MS, getJSON, setJSON } from './cache';

export const ipapiQuery = async (
  ip: string,
  lang?: string
): Promise<IPGeoLocationData | undefined> => {
  try {
    const cacheHash = createHash('md5').update(ip).digest('hex');
    const cacheKey = `myip:ipapi:${cacheHash}${lang ? `:${lang}` : ''}`;
    const cached = await getJSON<IPGeoLocationData>(cacheKey);
    if (
      cached &&
      cached.updatedAt &&
      Date.now() - cached.updatedAt < DEFAULT_EXPIRES_MS
    ) {
      return cached;
    }

    const res = await getGeoLocationData(ip, lang);
    if (res) {
      const { asn, org } = parseASNData(res.as);
      const data: IPGeoLocationData = {
        ip: res.query,
        continent_code: res.continentCode,
        continent_name: res.continent,
        country_code: res.countryCode,
        country_name: res.country,
        region_code: res.region,
        region_name: res.regionName,
        city_name: res.city,
        district_name: res.district,
        postal: res.zip,
        latitude: res.lat,
        longitude: res.lon,
        isp: res.isp,
        org: res.org ? res.org : org,
        asn: asn,
        timezone: res.timezone,
        source: 'ipapi'
      };

      if (['HK', 'MO', 'TW'].includes(data.country_code || '')) {
        data.country_name =
          lang === 'zh-CN'
            ? `${getNameByLang(CHINA.names, lang)}${data.country_name}`
            : `${data.country_name}, ${getNameByLang(CHINA.names, lang)}`;
      }

      const cachedData = pruneObject(data);

      await setJSON(cacheKey, cachedData);

      return cachedData;
    }
  } catch (err) {
    console.error(err);
  }
};

const getGeoLocationData = async (
  ip: string,
  lang?: string
): Promise<IPAPIResponse | undefined> => {
  if (!ip) return;

  try {
    const url = new URL(`http://ip-api.com/json/${ip}`);
    url.searchParams.set('fields', '20709375');
    if (lang) {
      url.searchParams.set('lang', lang);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json;charset=UTF-8'
      }
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const result: IPAPIResponse = await res.json();
    if (result && result.status === 'success') {
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error(error);
  }
};
