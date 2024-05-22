# This is MyIP

My IP and Network Information, Using GeoLite2 Free and qqwry.dat database.

## Features

- [GeoLite2 Free](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) - GeoLite2 free geolocation data.
- [qqwry.dat](https://github.com/metowolf/qqwry.dat) - qqwry.dat geolocation data.
- [qqwry.ipdb](https://github.com/metowolf/qqwry.ipdb) - qqwry.dat formatted from qqwry.ipdb.

## Getting Started

First, run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Update GeoLite2 and qqwry.dat

```bash
pnpm update-db YOUR_MAXMIND_LICENSE_KEY
```

## Deploy on Vercel

You can deploy your MyIP to Vercel with one click:

[Deploy with Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
