'use client';

import React, { FormEvent, useState } from 'react';

import { IPGeoLocationData } from '@/lib/types';

interface IPGeoLocationProps {
  defaultValue?: IPGeoLocationData | null;
}

export function IPGeoLocation({ defaultValue }: IPGeoLocationProps) {
  const [data, setData] = useState(defaultValue);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get('query');
    const response = await fetch(`/json/${query}`);
    const json = await response.json();

    setData(json);
  }

  return (
    <>
      <form className="w-full mb-6" onSubmit={onSubmit}>
        <div className="relative w-full">
          <input
            type="search"
            name="query"
            className="block px-3 py-2 pr-14 w-full z-20 text-lg text-gray-900 bg-gray-50 font-medium rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 outline-none"
            placeholder="Enter IP Address..."
            defaultValue={data?.ip}
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 px-3 py-2.5 h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </form>
      <table className="w-full rounded-lg overflow-hidden">
        <tbody>
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 w-28 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              IP
            </td>
            <td className="px-2 py-1">{data?.ip}</td>
          </tr>
          {data?.hostname && (
            <tr className="border-b-2 border-white last:border-b-0">
              <td className="px-2 py-1 w-24 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                Hostname
              </td>
              <td className="px-2 py-1">{data?.hostname}</td>
            </tr>
          )}
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              City
            </td>
            <td className="px-2 py-1">{data?.city}</td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Region
            </td>
            <td className="px-2 py-1">{data?.regionName}</td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Country
            </td>
            <td className="px-2 py-1">{data?.countryName}</td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              AS
            </td>
            <td className="px-2 py-1 break-words hyphens-auto">{data?.as}</td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Location
            </td>
            <td className="px-2 py-1">
              {[data?.latitude, data?.longitude].filter(Boolean).join(', ')}
            </td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Timezone
            </td>
            <td className="px-2 py-1 text-gray-800">{data?.timezone}</td>
          </tr>
          <tr className="border-b-2 border-white last:border-b-0">
            <td className="px-2 py-1 text-right text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              User Agent
            </td>
            <td className="px-2 py-1 text-gray-800">{data?.userAgent}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
