import type { Metadata } from 'next';
import { Anton, Inter, Rajdhani, Bodoni_Moda } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { ScrollSpine } from '@/components/svg/ScrollSpine';

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

const bodoni = Bodoni_Moda({
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const headersList = await headers();

  const aesthetic = cookieStore.get('corvo_aesthetic')?.value;
  const pathname = headersList.get('x-pathname') ?? '/';

  const themeClass = aesthetic === 'luxury' ? 'luxury' : 'dark';
  const isChooser = pathname === '/';

  return (
    <html
      lang="en"
      className={`${anton.variable} ${rajdhani.variable} ${inter.variable} ${bodoni.variable} h-full antialiased ${themeClass}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <SmoothScroll>
            {!isChooser && <Header />}
            <main className="flex-1">{children}</main>
            {!isChooser && <Footer />}
            {!isChooser && <ScrollSpine variant={themeClass === 'luxury' ? 'luxury' : 'savage'} />}
            <CartDrawer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
