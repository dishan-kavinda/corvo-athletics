import type { Metadata } from 'next';
import { Anton, Inter, Rajdhani } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ThemeProvider } from '@/providers/ThemeProvider';

const anton = Anton({
  weight: '400',
  variable: '--font-anton',
  subsets: ['latin'],
  display: 'swap',
});

const rajdhani = Rajdhani({
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.corvoathletic.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Corvo Athletic — Premium Gym, Athleisure & Sports Apparel',
    template: '%s — Corvo Athletic',
  },
  description:
    "Corvo Athletic. Luxury gym apparel, premium athleisure, and lab-tested supplements. Engineered for athletes who don't accept average.",
  keywords: [
    'Corvo Athletic',
    'Corvo Athletic',
    'gym',
    'athleisure',
    'luxury',
    'sports',
    'premium gym apparel',
    'protein powder',
    'gym supplements',
    'luxury sportswear',
    'athletic wear',
  ],
  applicationName: 'Corvo Athletic',
  authors: [{ name: 'Corvo Athletic' }],
  creator: 'Corvo Athletic',
  publisher: 'Corvo Athletic',
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: siteUrl,
    siteName: 'Corvo Athletic',
    title: 'Corvo Athletic — Premium Gym, Athleisure & Sports Apparel',
    description:
      "Luxury gym apparel, premium athleisure, and lab-tested supplements. Engineered for athletes who don't accept average.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corvo Athletic — Premium Gym, Athleisure & Sports Apparel',
    description:
      "Luxury gym apparel, premium athleisure, and lab-tested supplements. Engineered for athletes who don't accept average.",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Corvo Athletic',
  alternateName: 'Corvo Athletic',
  url: siteUrl,
  description:
    "Luxury gym apparel, premium athleisure, and lab-tested supplements. Engineered for athletes who don't accept average.",
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${rajdhani.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
