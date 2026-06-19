import React, { Suspense } from 'react';
import '../styles/tokens.css';
import '../styles/site.css';
import '../styles/landing.css';
import '../styles/partner-modal.css';
import '../styles/panel.css';
import '../styles/bo.css';

export const metadata = {
  title: 'NÓMADE — Red de hospitalidad y bienestar',
  description: 'Una red de alojamiento y experiencias de bienestar en ubicaciones cuidadosamente seleccionadas.',
  metadataBase: new URL('https://nomade-landing.vercel.app'), // Ajustar al dominio final
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'NÓMADE — Red de hospitalidad y bienestar',
    description: 'Cada destino es único. La experiencia NÓMADE no.',
    url: '/',
    siteName: 'NÓMADE',
    images: [
      {
        url: '/assets/brand/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NÓMADE Hospitalidad',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NÓMADE — Red de hospitalidad y bienestar',
    description: 'Cada destino es único. La experiencia NÓMADE no.',
    images: ['/assets/brand/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
