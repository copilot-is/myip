import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyIP',
    short_name: 'MyIP',
    description: 'My IP and Network Information',
    scope: '/',
    start_url: '/?utm_source=pwa',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
