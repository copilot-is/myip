import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'My IP and Network Information - ipmy.dev',
  description: 'My IP and Network Information',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black">
        <div className="m-auto min-h-screen max-w-xs px-2 md:max-w-lg">
          <header className="flex w-full items-center justify-center gap-6 py-12">
            <a
              id="link-ipv4"
              href="/"
              className="text-5xl font-bold text-slate-700 hover:text-slate-800 hover:underline dark:text-slate-500 dark:hover:text-slate-400 "
            >
              My IP
            </a>
          </header>
          <main className="flex w-full flex-col items-center justify-center">
            {children}
            <footer className="mb-4 text-xs text-slate-600">
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
          </main>
        </div>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
