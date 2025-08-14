import { getLookups } from '@/lib/db';
import { ASN_MAP } from '@/lib/format';
import { CHINA, getNameByLang } from '@/lib/lang';
import { IPGeoLocationData } from '@/lib/types';

export const maxmindQuery = (
  ip: string,
  ua?: string,
  lang?: string
): IPGeoLocationData | undefined => {
  try {
    const { asn, city } = getLookups();
    const asnResponse = asn.get(ip);
    const cityResponse = city.get(ip);

    const data: IPGeoLocationData = {
      ip,
      postal: cityResponse?.postal?.code,
      city_code: cityResponse?.city?.geoname_id?.toString(),
      city_name: getNameByLang(cityResponse?.city?.names, lang),
      region_code: cityResponse?.subdivisions?.[0]?.iso_code,
      region_name: getNameByLang(cityResponse?.subdivisions?.[0]?.names, lang),
      country_code: cityResponse?.country?.iso_code,
      country_name: getNameByLang(cityResponse?.country?.names, lang),
      continent_code: cityResponse?.continent?.code,
      continent_name: getNameByLang(cityResponse?.continent?.names, lang),
      registered_region_code: cityResponse?.registered_country?.iso_code,
      registered_region_name: getNameByLang(
        cityResponse?.registered_country?.names,
        lang
      ),
      asn: asnResponse?.autonomous_system_number,
      org: asnResponse?.autonomous_system_organization,
      latitude: cityResponse?.location?.latitude,
      longitude: cityResponse?.location?.longitude,
      timezone: cityResponse?.location?.time_zone,
      isEU: cityResponse?.country?.is_in_european_union,
      user_agent: ua,
      source: 'maxmind'
    };

    if (asnResponse?.autonomous_system_number) {
      data.isp = ASN_MAP[asnResponse.autonomous_system_number];
    }

    if (['HK', 'MO', 'TW'].includes(cityResponse?.country?.iso_code || '')) {
      data.region_code = cityResponse?.country?.iso_code;
      data.region_name = getNameByLang(cityResponse?.country?.names, lang);
      data.country_code = 'CN';
      data.country_name = getNameByLang(CHINA.names, lang);
      data.registered_region_name =
        lang === 'zh-cn'
          ? `${getNameByLang(CHINA.names, lang)}${getNameByLang(cityResponse?.registered_country?.names, lang)}`
          : `${getNameByLang(cityResponse?.registered_country?.names, lang)}, ${getNameByLang(CHINA.names, lang)}`;
    }

    return data;
  } catch (err) {
    console.error(err);
  }
};
