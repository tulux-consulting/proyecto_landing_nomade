'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import all JSON dictionaries
import commonEs from '../../messages/es/common.json';
import landingEs from '../../messages/es/landing.json';
import cmsEs from '../../messages/es/cms.json';
import destinationsEs from '../../messages/es/destinations.json';
import usersEs from '../../messages/es/users.json';
import authEs from '../../messages/es/auth.json';

import commonEn from '../../messages/en/common.json';
import landingEn from '../../messages/en/landing.json';
import cmsEn from '../../messages/en/cms.json';
import destinationsEn from '../../messages/en/destinations.json';
import usersEn from '../../messages/en/users.json';
import authEn from '../../messages/en/auth.json';

const MESSAGES = {
  es: {
    common: commonEs,
    landing: landingEs,
    cms: cmsEs,
    destinations: destinationsEs,
    users: usersEs,
    auth: authEs
  },
  en: {
    common: commonEn,
    landing: landingEn,
    cms: cmsEn,
    destinations: destinationsEn,
    users: usersEn,
    auth: authEn
  }
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('es');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  useEffect(() => {
    // 1. Check cookies (important for matching SSR if needed)
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const cookieLocale = getCookie('nomade_locale');
    if (cookieLocale && (cookieLocale === 'es' || cookieLocale === 'en')) {
      setLocale(cookieLocale);
      return;
    }

    // 2. Check localStorage
    const storedLocale = localStorage.getItem('nomade_locale');
    if (storedLocale && (storedLocale === 'es' || storedLocale === 'en')) {
      setLocale(storedLocale);
      return;
    }

    // 3. Fallback to browser preference
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'es' || browserLang === 'en') {
      setLocale(browserLang);
    }
  }, []);

  const changeLocale = async (newLocale) => {
    if (newLocale !== 'es' && newLocale !== 'en') return;
    setLocale(newLocale);
    
    // Save to localStorage
    localStorage.setItem('nomade_locale', newLocale);
    // Save to cookie (valid for 1 year)
    document.cookie = `nomade_locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // If user is authenticated in panel, update their preferred language in Supabase
    try {
      const sessionUserStr = localStorage.getItem('nomade_bo_sessionUser');
      if (sessionUserStr) {
        const sessionUser = JSON.parse(sessionUserStr);
        // Look up active user in localStorage or Supabase
        const { createClient } = await import('../supabase/client.js');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').update({ preferred_language: newLocale }).eq('id', user.id);
          // Also update session user cache
          sessionUser.preferred_language = newLocale;
          localStorage.setItem('nomade_bo_sessionUser', JSON.stringify(sessionUser));
        }
      }
    } catch (e) {
      console.warn('Failed to update preferred language in user profile:', e);
    }
  };

  const TRANSLATIONS = {
    // Statuses (Estados)
    "Nuevo": { es: "Nuevo", en: "New" },
    "New": { es: "Nuevo", en: "New" },
    "nuevo": { es: "Nuevo", en: "New" },
    "new": { es: "Nuevo", en: "New" },
    "Pendiente de revisión": { es: "Pendiente de revisión", en: "Pending review" },
    "Pending review": { es: "Pendiente de revisión", en: "Pending review" },
    "pendiente de revisión": { es: "Pendiente de revisión", en: "Pending review" },
    "pending review": { es: "Pendiente de revisión", en: "Pending review" },
    "Contactado": { es: "Contactado", en: "Contacted" },
    "Contacted": { es: "Contactado", en: "Contacted" },
    "contactado": { es: "Contactado", en: "Contacted" },
    "contacted": { es: "Contactado", en: "Contacted" },
    "En negociación": { es: "En negociación", en: "In negotiation" },
    "In negotiation": { es: "En negociación", en: "In negotiation" },
    "en negociación": { es: "En negociación", en: "In negotiation" },
    "in negotiation": { es: "En negociación", en: "In negotiation" },
    "Aprobado": { es: "Aprobado", en: "Approved" },
    "Approved": { es: "Aprobado", en: "Approved" },
    "aprobado": { es: "Aprobado", en: "Approved" },
    "approved": { es: "Aprobado", en: "Approved" },
    "Rechazado": { es: "Rechazado", en: "Rejected" },
    "Rejected": { es: "Rechazado", en: "Rejected" },
    "rechazado": { es: "Rechazado", en: "Rejected" },
    "rejected": { es: "Rechazado", en: "Rejected" },
    "Disponible": { es: "Disponible", en: "Available" },
    "Available": { es: "Disponible", en: "Available" },
    "disponible": { es: "Disponible", en: "Available" },
    "available": { es: "Disponible", en: "Available" },
    "No disponible": { es: "No disponible", en: "Unavailable" },
    "Unavailable": { es: "No disponible", en: "Unavailable" },
    "no disponible": { es: "No disponible", en: "Unavailable" },
    "unavailable": { es: "No disponible", en: "Unavailable" },
    "Administrador": { es: "Administrador", en: "Administrator" },
    "Administrator": { es: "Administrador", en: "Administrator" },
    "Usuario": { es: "Usuario", en: "User" },
    "User": { es: "Usuario", en: "User" },
    "Archivado": { es: "Archivado", en: "Archived" },
    "Archived": { es: "Archivado", en: "Archived" },
    "archivado": { es: "Archivado", en: "Archived" },
    "archived": { es: "Archivado", en: "Archived" },

    // Tipos de establecimiento (Establishment Types)
    "Camping": { es: "Camping", en: "Camping" },
    "camping": { es: "Camping", en: "Camping" },
    "Glamping": { es: "Glamping", en: "Glamping" },
    "glamping": { es: "Glamping", en: "Glamping" },
    "Operador turístico": { es: "Operador turístico", en: "Tour operator" },
    "operador turístico": { es: "Operador turístico", en: "Tour operator" },
    "Tour operator": { es: "Operador turístico", en: "Tour operator" },
    "Tour Operator": { es: "Operador turístico", en: "Tour operator" },
    "Viñedo / Bodega": { es: "Viñedo / Bodega", en: "Vineyard / Winery" },
    "viñedo / bodega": { es: "Viñedo / Bodega", en: "Vineyard / Winery" },
    "Vineyard / Winery": { es: "Viñedo / Bodega", en: "Vineyard / Winery" },
    "Vineyard/Winery": { es: "Viñedo / Bodega", en: "Vineyard / Winery" },
    "Hospitalidad rural": { es: "Hospitalidad rural", en: "Rural hospitality" },
    "hospitalidad rural": { es: "Hospitalidad rural", en: "Rural hospitality" },
    "Rural hospitality": { es: "Hospitalidad rural", en: "Rural hospitality" },
    "Rural Hospitality": { es: "Hospitalidad rural", en: "Rural hospitality" },
    "Propiedad recreativa": { es: "Propiedad recreativa", en: "Recreational property" },
    "propiedad recreativa": { es: "Propiedad recreativa", en: "Recreational property" },
    "Recreational property": { es: "Propiedad recreativa", en: "Recreational property" },
    "Recreational Property": { es: "Propiedad recreativa", en: "Recreational property" },
    "Estación de servicio": { es: "Estación de servicio", en: "Service station" },
    "estación de servicio": { es: "Estación de servicio", en: "Service station" },
    "Service station": { es: "Estación de servicio", en: "Service station" },
    "Service Station": { es: "Estación de servicio", en: "Service station" },
    "Otro": { es: "Otro", en: "Other" },
    "otro": { es: "Otro", en: "Other" },
    "Other": { es: "Otro", en: "Other" },
    "other": { es: "Otro", en: "Other" },

    // Dispositivos (Devices)
    "Móvil": { es: "Móvil", en: "Mobile" },
    "mobile": { es: "Móvil", en: "Mobile" },
    "Mobile": { es: "Móvil", en: "Mobile" },
    "móvil": { es: "Móvil", en: "Mobile" },
    "Escritorio": { es: "Escritorio", en: "Desktop" },
    "desktop": { es: "Escritorio", en: "Desktop" },
    "Desktop": { es: "Escritorio", en: "Desktop" },
    "escritorio": { es: "Escritorio", en: "Desktop" },
    "Tablet": { es: "Tablet", en: "Tablet" },
    "tablet": { es: "Tablet", en: "Tablet" },

    // Relación con el terreno
    "Propietario": { es: "Propietario", en: "Owner" },
    "Copropietario": { es: "Copropietario", en: "Co-owner" },
    "Representante / apoderado": { es: "Representante / apoderado", en: "Representative / proxy" },
    "En sociedad": { es: "En sociedad", en: "In partnership" },

    // Tamaños (Sizes)
    "Menos de 1 ha": { es: "Menos de 1 ha", en: "Less than 1 ha" },
    "1 – 5 ha": { es: "1 – 5 ha", en: "1 – 5 ha" },
    "5 – 20 ha": { es: "5 – 20 ha", en: "5 – 20 ha" },
    "20 – 100 ha": { es: "20 – 100 ha", en: "20 – 100 ha" },
    "Más de 100 ha": { es: "Más de 100 ha", en: "More than 100 ha" },

    // Topografías (Topography)
    "Llano": { es: "Llano", en: "Flat" },
    "Ondulado": { es: "Ondulado", en: "Hilly" },
    "Montañoso": { es: "Montañoso", en: "Mountainous" },
    "Mixto": { es: "Mixto", en: "Mixed" },

    // Paisajes (Landscape)
    "Montaña": { es: "Montaña", en: "Mountain" },
    "Bosque": { es: "Bosque", en: "Forest" },
    "Lago": { es: "Lago", en: "Lake" },
    "Río o arroyo": { es: "Río o arroyo", en: "River or stream" },
    "Sierra": { es: "Sierra", en: "Hills" },
    "Viñedo": { es: "Viñedo", en: "Vineyard" },
    "Costa": { es: "Costa", en: "Coast" },
    "Campo": { es: "Campo", en: "Field" },
    "Desierto": { es: "Desierto", en: "Desert" },

    // Cuerpos de agua (Water bodies)
    "Mar o costa": { es: "Mar o costa", en: "Sea or coast" },
    "Vertiente": { es: "Vertiente", en: "Spring water" },
    "Ninguno": { es: "Ninguno", en: "None" },

    // Accesos (Access)
    "Asfalto": { es: "Asfalto", en: "Asphalt" },
    "Ripio": { es: "Ripio", en: "Gravel" },
    "Tierra": { es: "Tierra", en: "Dirt road" },

    // Estacionalidad (Seasonality)
    "Todo el año": { es: "Todo el año", en: "All year round" },
    "Sólo temporada alta": { es: "Sólo temporada alta", en: "Only peak season" },
    "Depende del clima": { es: "Depende del clima", en: "Weather dependent" },

    // Servicios (Services)
    "Electricidad": { es: "Electricidad", en: "Electricity" },
    "Agua": { es: "Agua", en: "Water" },
    "Gas": { es: "Gas", en: "Gas" },
    "Internet / señal": { es: "Internet / señal", en: "Internet / signal" },
    "Cloacas": { es: "Cloacas", en: "Sewers" },
    "Caminos internos": { es: "Caminos internos", en: "Internal roads" },

    // Construcciones
    "Sí, habitables": { es: "Sí, habitables", en: "Yes, habitable" },
    "Sí, a refaccionar": { es: "Sí, a refaccionar", en: "Yes, to renovate" },

    // Título legal
    "Título perfecto": { es: "Título perfecto", en: "Perfect title deed" },
    "En trámite": { es: "En trámite", en: "In process" },
    "Posesión": { es: "Posesión", en: "Possession" },
    "Otro": { es: "Otro", en: "Other" },

    // Uso del suelo
    "Habilitado para turismo": { es: "Habilitado para turismo", en: "Approved for tourism" },
    "A consultar": { es: "A consultar", en: "To be checked" },
    "No habilitado": { es: "No habilitado", en: "Not approved" },
    "No lo sé": { es: "No lo sé", en: "Don't know" },

    // Actividades (Activities)
    "Senderismo": { es: "Senderismo", en: "Hiking" },
    "Pesca": { es: "Pesca", en: "Fishing" },
    "Cabalgatas": { es: "Cabalgatas", en: "Horseback riding" },
    "Náutica": { es: "Náutica", en: "Water sports" },
    "Vino y gastronomía": { es: "Vino y gastronomía", en: "Wine & gastronomy" },
    "Cultura local": { es: "Cultura local", en: "Local culture" },
    "Avistaje": { es: "Avistaje", en: "Wildlife watching" },
    "Ciclismo": { es: "Ciclismo", en: "Cycling" },

    // Demanda (Demand)
    "Alta": { es: "Alta", en: "High" },
    "Media": { es: "Media", en: "Medium" },
    "Baja / emergente": { es: "Baja / emergente", en: "Low / emerging" },

    // Modelos de interés (Models)
    "Aporte de tierra en sociedad": { es: "Aporte de tierra en sociedad", en: "Land contribution in partnership" },
    "Arrendamiento de largo plazo": { es: "Arrendamiento de largo plazo", en: "Long-term lease" },
    "Venta": { es: "Venta", en: "Sale" },
    "Abierto a evaluar": { es: "Abierto a evaluar", en: "Open to evaluation" },

    // Inversión (Investment)
    "Sí": { es: "Sí", en: "Yes" },
    "Parcial": { es: "Parcial", en: "Partial" },
    "A evaluar": { es: "A evaluar", en: "To be evaluated" },

    // Horizontes
    "Cuanto antes": { es: "Cuanto antes", en: "As soon as possible" },
    "Dentro de 1 año": { es: "Dentro de 1 año", en: "Within 1 year" },
    "1 – 3 años": { es: "1 – 3 años", en: "1 – 3 years" },
    "Sin definir": { es: "Sin definir", en: "Undefined" }
  };

  const tValue = (val) => {
    if (!val) return val;
    if (Array.isArray(val)) {
      return val.map(v => tValue(v));
    }
    const match = TRANSLATIONS[val];
    if (match) {
      return match[locale] || val;
    }
    return val;
  };

  const t = (key, params = {}) => {
    const parts = key.split('.');
    let current = MESSAGES[locale];
    for (const part of parts) {
      if (current === undefined || current === null) return key;
      current = current[part];
    }
    if (typeof current !== 'string') return key;

    let text = current;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
    });
    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t, tValue }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
