import type { Metadata } from 'next';
import './globals.css';

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
      <body className='antialiased font-sans font-display'>{children}</body>
    </html>
  );
}
