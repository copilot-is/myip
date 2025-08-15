'use client';

import React, { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import isFQDN from 'validator/lib/isFQDN';
import isIP from 'validator/lib/isIP';

import { IPGeoLocationData } from '@/lib/types';
import { IconLoader, IconSearch } from '@/components/Icons';

interface IPGeoLocationProps {
  defaultValue?: IPGeoLocationData;
}

export function IPGeoLocation({ defaultValue }: IPGeoLocationProps) {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setLoading] = useState<boolean>(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const query = formData.get('query')?.toString();

    if (query && (isIP(query) || isFQDN(query))) {
      const lang = navigator.language;
      const res = await fetch(`/api/${query}${lang ? `?lang=${lang}` : ''}`);
      const json = await res.json();

      if (res.ok) {
        setData(json);
      } else {
        toast.error(json.error);
      }
    } else {
      toast.error('Invalid IP address or domain.');
    }

    setLoading(false);
  }

  return (
    <div className="m-auto w-full px-3 sm:max-w-lg">
      <form className="mb-6 w-full" onSubmit={onSubmit}>
        <div className="flex w-full justify-between">
          <input
            type="search"
            name="query"
            className="h-12 w-full rounded-l-lg rounded-r-none border border-r-0 border-slate-300 bg-slate-50 pl-3 pr-2 text-lg font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:placeholder:text-slate-400 dark:focus:border-blue-500"
            placeholder="Enter IP address or domain..."
            defaultValue={data?.ip}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-r-lg bg-blue-700 px-4 text-white hover:bg-blue-800 disabled:opacity-60 dark:bg-blue-600 dark:text-slate-900 dark:hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <IconLoader className="size-5 animate-spin" />
                <span className="sr-only">Loading</span>
              </>
            ) : (
              <>
                <IconSearch className="size-5" />
                <span className="sr-only">Search</span>
              </>
            )}
          </button>
        </div>
      </form>
      {data && (
        <table className="w-full overflow-hidden rounded-lg dark:bg-slate-900">
          <tbody>
            <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
              <td className="w-28 bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                IP
              </td>
              <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                <div className="break-all">{data.ip}</div>
              </td>
            </tr>
            {data.hostname && (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  Hostname
                </td>
                <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.hostname}
                </td>
              </tr>
            )}
            {data.city_name && (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  City
                </td>
                <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.city_name}
                </td>
              </tr>
            )}
            {data.postal && (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  Postal
                </td>
                <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.postal}
                </td>
              </tr>
            )}
            {data.region_name && (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  Region
                </td>
                <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.region_name}
                </td>
              </tr>
            )}
            {data.country_name && (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  Country
                </td>
                <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.country_name}
                </td>
              </tr>
            )}
            {data.isp ? (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  ISP
                </td>
                <td className="hyphens-auto break-words px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.isp}
                </td>
              </tr>
            ) : (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  AS
                </td>
                <td className="hyphens-auto break-words px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.org}
                </td>
              </tr>
            )}
            {data.latitude && data.longitude && (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  Location
                </td>
                <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                  {[data.latitude, data.longitude].filter(Boolean).join(', ')}
                </td>
              </tr>
            )}
            {data.timezone && (
              <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
                <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                  Timezone
                </td>
                <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                  {data.timezone}
                </td>
              </tr>
            )}
            <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
              <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                User Agent
              </td>
              <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                {data.user_agent}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <div className="mt-3 w-full rounded-lg bg-slate-100 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <code>
          ipmy.dev/api
          <br />
          ipmy.dev/api/8.8.8.8
        </code>
      </div>
    </div>
  );
}
