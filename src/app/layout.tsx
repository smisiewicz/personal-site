import type { Metadata, Viewport } from 'next';
import { Exo_2, Orbitron, Share_Tech_Mono } from 'next/font/google';

import './globals.css';

const orbitron = Orbitron({ subsets: ['latin'], display: 'swap', variable: '--font-orbitron' });
const exo = Exo_2({ subsets: ['latin'], display: 'swap', variable: '--font-exo' });
const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-share-tech-mono',
});

export const metadata: Metadata = {
  title: 'Sebastian Misiewicz | Software Developer',
  description:
    'Personal portfolio of Sebastian Misiewicz — Software Developer with 16+ years of experience in mobile and web development.',
};

export const viewport: Viewport = {
  themeColor: '#02080e',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo.variable} ${shareTechMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
