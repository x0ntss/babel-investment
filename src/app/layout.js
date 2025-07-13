import "./globals.css";
import { ChakraProviders } from "./providers/ChakraProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ClientLayout from "./components/ClientLayout";
import PerformanceMonitor from "./components/PerformanceMonitor";

export const metadata = {
  title: 'Babel Investment',
  description: 'منصة بابل للاستثمار - استثمار آمن وموثوق في العملات الرقمية',
  keywords: 'استثمار, عملات رقمية, USDT, منصة بابل',
  authors: [{ name: 'Babel Investment' }],
  creator: 'Babel Investment',
  publisher: 'Babel Investment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://babel-investment.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Babel Investment',
    description: 'منصة بابل للاستثمار - استثمار آمن وموثوق في العملات الرقمية',
    url: 'https://babel-investment.com',
    siteName: 'Babel Investment',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Babel Investment Logo',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Babel Investment',
    description: 'منصة بابل للاستثمار - استثمار آمن وموثوق في العملات الرقمية',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ChakraProviders>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
            <PerformanceMonitor />
          </AuthProvider>
        </ChakraProviders>
      </body>
    </html>
  );
} 