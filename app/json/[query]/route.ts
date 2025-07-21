import { headers } from 'next/headers';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import { IPQuery } from '@/lib/ipquery';

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ query: string }> }
) {
  const { ua } = userAgent(req);
  const heads = await headers();
  const params = await props.params;
  const searchParams = req.nextUrl.searchParams;
  const lang = searchParams.get('lang') || undefined;
  const query = (
    params.query ||
    heads.get('cf-connecting-ip') ||
    heads.get('x-real-ip') ||
    heads.get('x-forwarded-for') ||
    '127.0.0.1'
  ).split(',')[0];

  const data = await IPQuery(query, ua, lang);

  return NextResponse.json(data);
}
