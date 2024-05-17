'use client';

import React, { FormEvent, useState } from 'react';

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
    const query = formData.get('query');
    const response = await fetch(`/json/${query}`);
    const json = await response.json();

    setData(json);
    setLoading(false);
  }

  return (
    <>
      <form className="w-full mb-6" onSubmit={onSubmit}>
        <div className="w-full flex justify-between">
          <input
            type="search"
            name="query"
            className="pl-3 pr-2 w-full h-12 text-lg text-slate-800 dark:text-slate-300 bg-slate-50 font-medium rounded-l-lg border border-r-0 border-slate-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:placeholder-slate-400 dark:focus:border-blue-500 outline-none disabled:opacity-60"
            placeholder="Enter IP Address..."
            defaultValue={data?.ip}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 h-12 text-white dark:text-slate-900 bg-blue-700 rounded-e-lg hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-60"
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
      <table className="w-full rounded-lg overflow-hidden dark:bg-slate-900">
        <tbody>
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 w-28 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              IP
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.ip}
            </td>
          </tr>
          {data?.hostname && (
            <tr className="border-b-2 border-white dark:border-black last:border-b-0">
              <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
                Hostname
              </td>
              <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
                {data?.hostname}
              </td>
            </tr>
          )}
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              City
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.city}
            </td>
          </tr>
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              Region
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.regionName}
            </td>
          </tr>
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              Country
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.countryName}
            </td>
          </tr>
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              AS
            </td>
            <td className="px-2 py-1 break-words hyphens-auto text-slate-800 dark:text-slate-400">
              {data?.as}
            </td>
          </tr>
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              Location
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {[data?.latitude, data?.longitude].filter(Boolean).join(', ')}
            </td>
          </tr>
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              Timezone
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.timezone}
            </td>
          </tr>
          <tr className="border-b-2 border-white dark:border-black last:border-b-0">
            <td className="px-2 py-1 text-right text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:border-r-2 dark:border-black">
              User Agent
            </td>
            <td className="px-2 py-1 text-slate-800 dark:text-slate-400">
              {data?.userAgent}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="w-full rounded-lg mt-3 mb-6 p-4 text-slate-800 bg-slate-100 dark:bg-slate-900 dark:text-slate-400">
        <p>https://myip.moe/json</p>
        <p>https://myip.moe/json/8.8.8.8?lang=en</p>
      </div>
    </>
  );
}
