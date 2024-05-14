import { getClientIp } from 'request-ip';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import maxmind from '@/lib/maxmind';

export async function GET(req: NextRequest) {
  const { ua } = userAgent(req);
  const ip = getClientIp(req as { headers: { [key: string]: any } });

  const data = await maxmind.get(ip, ua);

  return NextResponse.json(data);
}
