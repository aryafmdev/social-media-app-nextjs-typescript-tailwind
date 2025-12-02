import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Sociality AryaFMDev',
  description: 'Social Media App Developed by AryaFMDev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased font-sans font-display'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
