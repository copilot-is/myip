import fs from 'fs';
import path from 'path';
import { AsnResponse, CityResponse, Reader } from 'maxmind';

import { ChinaResponse } from '@/lib/types';

const lookupCache = {
  asnLookup: null as Reader<AsnResponse> | null,
  cityLookup: null as Reader<CityResponse> | null,
  cnLookup: null as Reader<ChinaResponse> | null
};

export function initialize() {
  if (!lookupCache.asnLookup) {
    const asnBuffer = fs.readFileSync(
      path.join(process.cwd(), '/db/GeoLite2-ASN.mmdb')
    );
    lookupCache.asnLookup = new Reader<AsnResponse>(asnBuffer);
  }
  if (!lookupCache.cityLookup) {
    const cityBuffer = fs.readFileSync(
      path.join(process.cwd(), '/db/GeoLite2-City.mmdb')
    );
    lookupCache.cityLookup = new Reader<CityResponse>(cityBuffer);
  }
  if (!lookupCache.cnLookup) {
    const cnBuffer = fs.readFileSync(
      path.join(process.cwd(), '/db/GeoCN.mmdb')
    );
    lookupCache.cnLookup = new Reader<ChinaResponse>(cnBuffer);
  }
}

export function getLookups() {
  return {
    asnLookup: lookupCache.asnLookup!,
    cityLookup: lookupCache.cityLookup!,
    cnLookup: lookupCache.cnLookup!
  };
}

initialize();
