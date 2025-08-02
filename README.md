# MyIP

My IP and Network Information, Using the GeoLite2 Free and GeoCN database.

## Features

- [GeoLite2 Free](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) - geolite2 free IP geolocation data.
- [GeoCN](https://github.com/ljxi/GeoCN) - China IP geolocation data.

## Getting Started

First, run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Update GeoLite2 and GeoCN database

Add `MAXMIND_LICENSE_KEY` to .env

```bash
pnpm update-db
```

## Deploy on Vercel

You can deploy your MyIP to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/copilot-is/myip)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
