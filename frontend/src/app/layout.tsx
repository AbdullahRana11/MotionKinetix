import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Apex Kinematics | Elite Biomechanics Engine',
  description:
    'AI-driven computer vision, skeletal canvas telemetry, and DTW analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} min-h-screen font-sans`}>
        {children}
      </body>
    </html>
  );
}
