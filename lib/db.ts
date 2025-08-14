import fs from 'fs';
import path from 'path';
import IPDB from 'ipdb';
import { AsnResponse, CityResponse, Reader } from 'maxmind';

import { ChinaResponse } from '@/lib/types';

const lookupCache = {
  asn: null as Reader<AsnResponse> | null,
  city: null as Reader<CityResponse> | null,
  geocn: null as Reader<ChinaResponse> | null,
  qqwry: null as IPDB | null
};

export function initialize() {
  if (!lookupCache.asn) {
    const asnBuffer = fs.readFileSync(
      path.join(process.cwd(), '/db/GeoLite2-ASN.mmdb')
    );
    lookupCache.asn = new Reader<AsnResponse>(asnBuffer);
  }
  if (!lookupCache.city) {
    const cityBuffer = fs.readFileSync(
      path.join(process.cwd(), '/db/GeoLite2-City.mmdb')
    );
    lookupCache.city = new Reader<CityResponse>(cityBuffer);
  }
  if (!lookupCache.geocn) {
    const cnBuffer = fs.readFileSync(
      path.join(process.cwd(), '/db/GeoCN.mmdb')
    );
    lookupCache.geocn = new Reader<ChinaResponse>(cnBuffer);
  }
  if (!lookupCache.qqwry) {
    lookupCache.qqwry = new IPDB(path.join(process.cwd(), '/db/qqwry.ipdb'));
  }
}

export function getLookups() {
  if (
    !lookupCache.asn ||
    !lookupCache.city ||
    !lookupCache.geocn ||
    !lookupCache.qqwry
  ) {
    initialize();
  }
  return {
    asn: lookupCache.asn!,
    city: lookupCache.city!,
    geocn: lookupCache.geocn!,
    qqwry: lookupCache.qqwry!
  };
}
