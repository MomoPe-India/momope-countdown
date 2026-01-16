import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "MomoPe - Pay & Earn Rewards",
  description: "The most rewarding way to pay at your favorite local shops.",
  icons: {
    icon: '/assets/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
