import { headers } from 'next/headers';
import { NextRequest, NextResponse, userAgent } from 'next/server';
import isFQDN from 'validator/lib/isFQDN';
import isIP from 'validator/lib/isIP';

import { IPLookup } from '@/lib/iplookup';
import { IPGeoLocationData } from '@/lib/types';
import { getDomainAddress } from '@/lib/utils';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const { ua } = userAgent(req);
  const heads = await headers();
  const searchParams = req.nextUrl.searchParams;
  const lang = searchParams.get('lang') || undefined;
  const callback = searchParams.get('callback') || undefined;
  const source = (searchParams.get('source') || undefined) as
    | IPGeoLocationData['source']
    | undefined;
  const query = (
    heads.get('cf-connecting-ip') ||
    heads.get('x-real-ip') ||
    heads.get('x-forwarded-for') ||
    '127.0.0.1'
  ).split(',')[0];

  if (!query || (!isIP(query) && !isFQDN(query))) {
    return NextResponse.json(
      { error: 'Invalid query. Provide a valid IPv4, IPv6 address or domain.' },
      { status: 400 }
    );
  }

  if (source && !['qqwry', 'baidu', 'meituan'].includes(source)) {
    return NextResponse.json(
      {
        error:
          "Invalid source. Allowed values are 'qqwry' 'baidu' or 'meituan'."
      },
      { status: 400 }
    );
  }

  let ip = query;
  if (isFQDN(query)) {
    const ipAddress = await getDomainAddress(query);
    if (!ipAddress) {
      return NextResponse.json(
        {
          error: 'Invalid query. Provide a valid IPv4, IPv6 address or domain.'
        },
        { status: 400 }
      );
    }
    ip = ipAddress;
  }

  const data = await IPLookup(ip, ua, lang, source);
  if (!data) {
    return NextResponse.json(
      { error: 'No geolocation data found for the requested IP or domain.' },
      { status: 404 }
    );
  }

  if (callback) {
    const jsonp = `${callback}(${JSON.stringify(data)})`;
    return new NextResponse(jsonp, {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript; charset=utf-8'
      }
    });
  }

  return NextResponse.json(data);
}
