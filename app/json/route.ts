import { headers } from 'next/headers';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import { IPLookup } from '@/lib/iplookup';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const { ua } = userAgent(req);
  const heads = await headers();
  const searchParams = req.nextUrl.searchParams;
  const lang = searchParams.get('lang') || undefined;
  const callback = searchParams.get('callback') || undefined;
  const ip = (
    heads.get('cf-connecting-ip') ||
    heads.get('x-real-ip') ||
    heads.get('x-forwarded-for') ||
    '127.0.0.1'
  ).split(',')[0];

  const data = await IPLookup(ip, ua, lang);

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
