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

  return (
    <>
      <header className="flex w-full items-center justify-center gap-6 py-12">
        <a
          href="/"
          className="text-5xl font-bold text-slate-700 hover:text-slate-800 hover:underline dark:text-slate-500 dark:hover:text-slate-400 "
        >
          My IP
        </a>
      </header>
      <main className="w-full">
        <IPGeoLocation defaultValue={data} />
      </main>
      <footer className="mb-4 text-center text-xs text-slate-600">
        <span className="mr-0.5">©</span>
        <a href="https://ipmy.dev" className="mr-1 hover:underline">
          ipmy.dev.
        </a>
        <span>All Rights Reserved.</span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="pl-1 hover:underline"
          href="https://github.com/copilot-is/myip"
        >
          GitHub
        </a>
      </footer>
    </>
  );
}
