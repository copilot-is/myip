import { headers } from 'next/headers';

import { IPQuery } from '@/lib/ipquery';
import { IPGeoLocation } from '@/components/IPGeoLocation';

export const maxDuration = 60;

export default async function Home() {
  const heads = await headers();
  const ua = heads.get('user-agent') || undefined;
  const ip = (
    heads.get('cf-connecting-ip') ||
    heads.get('x-real-ip') ||
    heads.get('x-forwarded-for') ||
    '127.0.0.1'
  ).split(',')[0];

  const data = await IPQuery(ip, ua);

  return <IPGeoLocation defaultValue={data} />;
}
