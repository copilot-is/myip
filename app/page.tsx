import { headers } from 'next/headers';

import { IPQuery } from '@/lib/ipquery';
import { IPGeoLocation } from '@/components/IPGeoLocation';

export const maxDuration = 60;

export default async function Home() {
  const ua = headers().get('user-agent');
  const ip = (
    headers().get('cf-connecting-ip') ||
    headers().get('x-real-ip') ||
    headers().get('x-forwarded-for') ||
    '127.0.0.1'
  ).split(',')[0];

  const data = await IPQuery(ip, ua);

  return <IPGeoLocation defaultValue={data} />;
}
