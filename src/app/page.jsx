'use client';

// NÓMADE — public landing page in Next.js (App Router).
import React, { useState, useEffect } from 'react';
import { NOMADE } from '../data/content.js';
import { ContenidoRepository } from '../repositories/index.ts';
import { useLucide, scrollToId } from '../components/landing/primitives.jsx';
import { Nav } from '../components/landing/Nav.jsx';
import { Hero, WhatIs, Experience, Split } from '../components/landing/Sections1.jsx';
import { Destinations, Model } from '../components/landing/Sections2.jsx';
import { Landowners, Process } from '../components/landing/Sections3.jsx';
import { Partners, FutureGuests, Footer } from '../components/landing/Sections4.jsx';
import dynamic from 'next/dynamic';
import { Spinner } from '../components/panel/ui/Feedback.jsx';

const LeadForm = dynamic(() => import('../components/landing/LeadForm.jsx').then((m) => m.LeadForm), {
  ssr: false,
  loading: () => <Spinner message="Cargando evaluación..." size="sm" />
});

const PartnerModal = dynamic(() => import('../components/landing/PartnerModal.jsx').then((m) => m.PartnerModal), {
  ssr: false
});

export default function LandingPage() {
  const [content, setContent] = useState(null);
  const [toast, setToast] = useState(null);
  const [partnerOpen, setPartnerOpen] = useState(false);
  useLucide();

  useEffect(() => {
    ContenidoRepository.getPublished().then((data) => {
      setContent(data);
    });
  }, []);

  if (!content) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1d1d1b' }}>
        <Spinner message="Cargando NÓMADE..." onDark={true} size="lg" />
      </div>
    );
  }

  const D = content;

  const cta = (label) => {
    setToast(
      label === "Contacto" ?
      "Escribinos a hola@nomade.com — te respondemos pronto." :
      `“${label}” — gracias por tu interés. Te contactaremos pronto.`
    );
    clearTimeout(window.__t);
    window.__t = setTimeout(() => setToast(null), 3800);
  };

  // Structured Data (JSON-LD) for LocalBusiness & Organization
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'NÓMADE Red de Hospitalidad',
    'image': 'https://nomade-landing.vercel.app/assets/brand/og-image.jpg',
    '@id': 'https://nomade-landing.vercel.app/#organization',
    'url': 'https://nomade-landing.vercel.app',
    'telephone': '+5491155550000',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Av. de los Lagos',
      'addressLocality': 'Villa La Angostura',
      'addressRegion': 'Río Negro',
      'postalCode': '8407',
      'addressCountry': 'AR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -40.763,
      'longitude': -71.642
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '00:00',
      'closes': '23:59'
    },
    'sameAs': [
      'https://www.instagram.com/nomade',
      'https://www.linkedin.com/company/nomade'
    ]
  };

  return (
    <React.Fragment>
      {/* Inject Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#que-es"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("que-es");
          const el = document.getElementById("que-es");
          if (el) {
            el.setAttribute("tabindex", "-1");
            el.focus({ preventScroll: true });
          }
        }}
      >
        Saltar al contenido
      </a>
      <Nav />
      <main id="main">
        <Hero d={D.hero} />
        <WhatIs d={D.whatis} />
        <Experience d={D.experience} />
        <Split d={D.split} />
        <Destinations d={D.destinations} />
        <Model d={D.model} />
        <Landowners d={D.landowners} />
        <Process d={D.process} />
        <LeadForm d={NOMADE.form} />
        <Partners d={D.partners} onCta={cta} onPartner={() => setPartnerOpen(true)} />
        <FutureGuests d={D.guests} />
      </main>
      <Footer d={D.footer} onCta={cta} />
      <PartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
      {toast && <div className="nm-toast" role="status" aria-live="polite">{toast}</div>}
    </React.Fragment>
  );
}
