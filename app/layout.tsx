import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Emmy Social Digital Hub — Buy Airtime, Data, Pay Bills',
  description:
    'Your One-Stop Digital Service Hub. Buy airtime, data, pay electricity bills, renew TV subscriptions, buy exam PINs, sell gift cards, rent virtual numbers, and more.',
  keywords: [
    'airtime',
    'data',
    'VTU',
    'bill payment',
    'gift cards',
    'virtual numbers',
    'eSIM',
    'Nigeria',
    'Emmy Hub',
  ],
  openGraph: {
    title: 'Emmy Social Digital Hub — Buy Airtime, Data, Pay Bills',
    description:
      'Your One-Stop Digital Service Hub. Buy airtime, data, pay electricity bills, renew TV subscriptions, buy exam PINs, sell gift cards, rent virtual numbers, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmy Social Digital Hub — Buy Airtime, Data, Pay Bills',
    description:
      'Your One-Stop Digital Service Hub. Buy airtime, data, pay electricity bills, renew TV subscriptions, and digital services.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
