import { NextRequest, NextResponse, userAgent } from 'next/server';

import { IPQuery } from '@/lib/ipquery';

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: { query: string } }
) {
  const { ua } = userAgent(req);
  const searchParams = req.nextUrl.searchParams;
  const lang = searchParams.get('lang');
  const query = (
    params.query ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for') ||
    '127.0.0.1'
  ).split(',')[0];

  const data = await IPQuery(query, ua, lang);

  return NextResponse.json(data);
}
