import { NextRequest, NextResponse, userAgent } from 'next/server';

import maxmind from '@/lib/maxmind';

export async function GET(req: NextRequest) {
  const ip = req.ip || '127.0.0.1';
  const { ua } = userAgent(req);
  
  const data = await maxmind.get(ip, ua);

  return NextResponse.json(data);
}
