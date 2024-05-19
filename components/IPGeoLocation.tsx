'use client';

import React, { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import isIP from 'validator/lib/isIP';

import { IPGeoLocationData } from '@/lib/types';

import { IconLoader, IconSearch } from './Icons';

interface IPGeoLocationProps {
  defaultValue?: IPGeoLocationData | null;
}

export function IPGeoLocation({ defaultValue }: IPGeoLocationProps) {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setLoading] = useState<boolean>(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const query = formData.get('query')?.toString();

    if (query && isIP(query)) {
      const response = await fetch(`/json/${query}`);
      const json = await response.json();

      setData(json);
    } else {
      toast.error('Invalid ip address.');
    }

    setLoading(false);
  }

  return (
    <>
      <form className="mb-6 w-full" onSubmit={onSubmit}>
        <div className="flex w-full justify-between">
          <input
            type="search"
            name="query"
            className="h-12 w-full rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 pl-3 pr-2 text-lg font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-blue-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:placeholder:text-slate-400 dark:focus:border-blue-500"
            placeholder="Enter IP Address..."
            defaultValue={data?.ip}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-e-lg bg-blue-700 px-4 text-white hover:bg-blue-800 disabled:opacity-60 dark:bg-blue-600 dark:text-slate-900 dark:hover:bg-blue-700"
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
      <table className="w-full overflow-hidden rounded-lg dark:bg-slate-900">
        <tbody>
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="w-28 bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              IP
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.ip}
            </td>
          </tr>
          {data?.hostname && (
            <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
              <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
                Hostname
              </td>
              <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                {data?.hostname}
              </td>
            </tr>
          )}
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              City
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.city}
            </td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              Region
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.regionName}
            </td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              Country
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.countryName}
            </td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              AS
            </td>
            <td className="hyphens-auto break-words px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.as}
            </td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              Location
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {[data?.latitude, data?.longitude].filter(Boolean).join(', ')}
            </td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              Timezone
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.timezone}
            </td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0 dark:border-black">
            <td className="bg-slate-50 px-2 py-1 text-right text-slate-600 dark:border-r-2 dark:border-black dark:bg-slate-800 dark:text-slate-500">
              User Agent
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.userAgent}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mb-6 mt-3 w-full rounded-lg bg-slate-100 p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <p>https://myip.moe/json</p>
        <p>https://myip.moe/json/8.8.8.8?lang=en</p>
      </div>
    </>
  );
}
