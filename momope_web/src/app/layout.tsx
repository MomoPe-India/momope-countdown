import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "MomoPe - Pay & Earn Rewards | India's Most Rewarding Payment App",
  description: "Pay at local shops and earn rewards on every transaction. Zero fees, instant settlement, real rewards. Join India's fastest-growing payment ecosystem.",
  keywords: "UPI payments, digital payments India, payment rewards, Momo Coins, cashback app, merchant payments, QR code payments, instant settlement",
  authors: [{ name: "MomoPe Digital Hub Pvt. Ltd." }],
  creator: "MomoPe",
  publisher: "MomoPe Digital Hub Pvt. Ltd.",
  applicationName: "MomoPe",
  category: "Finance",
  icons: {
    icon: '/assets/favicon.png',
    apple: '/assets/favicon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.momope.com',
    siteName: 'MomoPe',
    title: 'MomoPe - Pay & Earn Rewards | India\'s Most Rewarding Payment App',
    description: 'Pay at local shops and earn rewards on every transaction. Zero fees, instant settlement, real rewards. Join India\'s fastest-growing payment ecosystem.',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MomoPe - Pay & Earn Rewards',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MomoPe_Deals',
    creator: '@MomoPe_Deals',
    title: 'MomoPe - Pay & Earn Rewards',
    description: 'Pay at local shops and earn rewards on every transaction. Zero fees, instant settlement, real rewards.',
    images: ['/assets/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code-here',
  },
  alternates: {
    canonical: 'https://www.momope.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2CB78A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <AppLaunchPopup />
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
