import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';

import './globals.css';

export const metadata: Metadata = {
  title: 'My IP and Network Information - myip.moe',
  description: 'My IP and Network Information',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black">
        <div className="min-h-screen md:max-w-md max-w-xs px-2 m-auto">
          <header className="w-full flex gap-6 items-center justify-center py-12">
            <a
              id="link-ipv4"
              href="/"
              className="text-slate-700 text-5xl font-bold hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-400 hover:underline "
            >
              My IP
            </a>
          </header>
          <main className="w-full flex flex-col items-center justify-center">
            {children}
            <footer className="text-xs text-slate-600 mb-4">
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
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
