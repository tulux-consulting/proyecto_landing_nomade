// NÓMADE — public landing page (route "/").
import React, { useState } from 'react';
import { NOMADE } from '../data/content.js';
import { useLucide, scrollToId } from '../components/landing/primitives.jsx';
import { Nav } from '../components/landing/Nav.jsx';
import { Hero, WhatIs, Experience, Split } from '../components/landing/Sections1.jsx';
import { Destinations, Model } from '../components/landing/Sections2.jsx';
import { Landowners, Process } from '../components/landing/Sections3.jsx';
import { Partners, FutureGuests, Footer } from '../components/landing/Sections4.jsx';
import { LeadForm } from '../components/landing/LeadForm.jsx';
import { PartnerModal } from '../components/landing/PartnerModal.jsx';

export default function LandingPage() {
  const D = NOMADE;
  const [toast, setToast] = useState(null);
  const [partnerOpen, setPartnerOpen] = useState(false);
  useLucide();

  const cta = (label) => {
    setToast(
      label === "Contacto" ?
      "Escribinos a hola@nomade.com — te respondemos pronto." :
      `“${label}” — gracias por tu interés. Te contactaremos pronto.`
    );
    clearTimeout(window.__t);
    window.__t = setTimeout(() => setToast(null), 3800);
  };

  return (
    <React.Fragment>
      <a href="#que-es" className="skip-link" onClick={(e) => {e.preventDefault();scrollToId("que-es");var el = document.getElementById("que-es");if (el) {el.setAttribute("tabindex", "-1");el.focus({ preventScroll: true });}}}>Saltar al contenido</a>
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
        <LeadForm d={D.form} />
        <Partners d={D.partners} onCta={cta} onPartner={() => setPartnerOpen(true)} />
        <FutureGuests d={D.guests} />
      </main>
      <Footer onCta={cta} />
      <PartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
      {toast && <div className="nm-toast" role="status" aria-live="polite">{toast}</div>}
    </React.Fragment>
  );
}
