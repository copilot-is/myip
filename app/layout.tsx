import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';

import './globals.css';

import Link from 'next/link';

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
      <body className="min-h-screen bg-white dark:bg-black">
        <header className="flex w-full items-center justify-center gap-6 py-12">
          <a
            href="/"
            className="text-5xl font-bold text-slate-700 hover:text-slate-800 hover:underline dark:text-slate-500 dark:hover:text-slate-400 "
          >
            My IP
          </a>
        </header>
        {children}
        <footer className="mb-4 mt-6 text-center text-xs text-slate-600">
          <span className="mr-0.5">©</span>
          <a href="https://ipmy.dev" className="mr-1 hover:underline">
            ipmy.dev.
          </a>
          <span>All Rights Reserved.</span>
          <Link href="/docs" className="px-1 hover:underline">
            API Documentation
          </Link>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            href="https://github.com/copilot-is/myip"
          >
            GitHub
          </a>
        </footer>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
