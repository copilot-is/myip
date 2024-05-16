import { headers } from 'next/headers';

import maxmind from '@/lib/maxmind';
import { IPGeoLocation } from '@/components/IPGeoLocation';

export default async function Home() {
  const ua = headers().get('user-agent');
  const ip = (
    headers().get('cf-connecting-ip') ||
    headers().get('x-real-ip') ||
    headers().get('x-forwarded-for') ||
    '127.0.0.1'
  ).split(',')[0];

  const data = await maxmind.get(ip, ua);

  return (
    <div className="min-h-screen md:max-w-md max-w-xs px-2 m-auto">
      <header className="w-full flex gap-6 items-center justify-center py-12">
        <a
          id="link-ipv4"
          href="/"
          className="text-gray-700 text-5xl font-bold hover:text-gray-800 hover:underline "
        >
          My IP
        </a>
      </header>
      <main className="w-full flex flex-col items-center justify-center">
        <IPGeoLocation defaultValue={data} />
        <div className="w-full rounded-lg mt-3 mb-6 p-4 text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <p>https://myip.moe/json</p>
          <p>https://myip.moe/json/8.8.8.8?lang=en</p>
        </div>
        <footer className="text-xs text-gray-600 mb-4">
          <span className="mr-0.5">©</span>
          <a href="https://myip.moe" className="hover:underline mr-1">
            MyIP.moe.
          </a>
          <span>All Rights Reserved.</span>
          <a
            className="pl-1 hover:underline"
            href="https://github.com/copilot-is/myip"
          >
            GitHub
          </a>
        </footer>
      </main>
    </div>
  );
}
