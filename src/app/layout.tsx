import type { Metadata } from 'next';
import { Anton, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const anton = Anton({
  weight: '400',
  variable: '--font-anton',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Corvo Athletics — Performance Fuel & Gym Apparel',
  description:
    "Premium protein, supplements, and training apparel. Engineered for athletes who don't quit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-bone font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
