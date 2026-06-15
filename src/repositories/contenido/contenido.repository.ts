import { BO } from '../../lib/store.js';
import { NOMADE } from '../../data/content.js';
import { LandingContent } from '../../types/index';
import { createClient } from '../../lib/supabase/client';

const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';
const getSupabase = () => createClient();

function getInitialContent(): LandingContent {
  const N = NOMADE as any;
  return {
    hero: {
      imagen: N.hero.imagen || N.hero.img || "",
      eyebrow: N.hero.eyebrow || "",
      titulo: N.hero.titulo || `${N.hero.h1a || ""} ${N.hero.h1b || ""}`.trim(),
      subtitulo: N.hero.subtitulo || `${N.hero.sub1 || ""} ${N.hero.sub2 || ""}`.trim(),
      lead: N.hero.lead || "",
      cta: N.hero.cta || ""
    },
    whatis: {
      eyebrow: N.whatis.eyebrow || "",
      h2: N.whatis.h2 || "",
      lead: N.whatis.lead || "",
      points: N.whatis.points || []
    },
    experience: {
      eyebrow: N.experience.eyebrow || "",
      h2: N.experience.h2 || "",
      lead: N.experience.lead || "",
      img: N.experience.img || "",
      pillars: N.experience.pillars || [],
      statement: N.experience.statement || []
    },
    split: {
      eyebrow: N.split.eyebrow || "",
      h2: N.split.h2 || "",
      lead: N.split.lead || "",
      options: [
        {
          kicker: N.split.left?.kicker || "",
          imagen: N.split.left?.img || "",
          h: N.split.left?.h || "",
          p: N.split.left?.p || "",
          cta: N.split.left?.cta || "",
          target: N.split.left?.target || ""
        },
        {
          kicker: N.split.right?.kicker || "",
          imagen: N.split.right?.img || "",
          h: N.split.right?.h || "",
          p: N.split.right?.p || "",
          cta: N.split.right?.cta || "",
          target: N.split.right?.target || ""
        }
      ]
    },
    destinations: {
      eyebrow: N.destinations.eyebrow || "",
      h2: N.destinations.h2 || "",
      lead: N.destinations.lead || "",
      types: N.destinations.types || [],
      note: N.destinations.note || "",
      mapEyebrow: N.destinations.mapEyebrow || "",
      mapH: N.destinations.mapH || "",
      mapLead: N.destinations.mapLead || "",
      disclaimer: N.destinations.disclaimer || "",
      terrain: N.destinations.terrain || "",
      regions: N.destinations.regions || {}
    },
    model: {
      eyebrow: N.model.eyebrow || "",
      h2: N.model.h2 || "",
      lead: N.model.lead || "",
      parts: N.model.parts || [],
      result: N.model.result || {}
    },
    landowners: {
      eyebrow: N.landowners.eyebrow || "",
      h2: N.landowners.h2 || "",
      lead: N.landowners.lead || "",
      img: N.landowners.img || "",
      qualifies: N.landowners.qualifies || { h: "", items: [] },
      disqualifies: N.landowners.disqualifies || { h: "", items: [] },
      benefits: N.landowners.benefits || [],
      cta: N.landowners.cta || ""
    },
    process: {
      eyebrow: N.process.eyebrow || "",
      h2: N.process.h2 || "",
      lead: N.process.lead || "",
      steps: N.process.steps || []
    },
    partners: {
      eyebrow: N.partners.eyebrow || "",
      h2: N.partners.h2 || "",
      lead: N.partners.lead || "",
      audiences: N.partners.audiences || [],
      value: N.partners.value || [],
      cta: N.partners.cta || ""
    },
    guests: {
      eyebrow: N.guests.eyebrow || "",
      h2: N.guests.h2 || "",
      lead: N.guests.lead || "",
      placeholder: N.guests.placeholder || "",
      cta: N.guests.cta || "",
      success: N.guests.success || "",
      note: N.guests.note || ""
    },
    footer: {
      tagline: "Una red de hospitalidad y bienestar. Experiencias extraordinarias, estándares consistentes, en ubicaciones cuidadosamente seleccionadas.",
      copyright: "© 2026 NÓMADE — todos los derechos reservados."
    }
  };
}

export const ContenidoRepository = {
  async get(): Promise<LandingContent> {
    let doc: any = null;
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('contenido').select('documento').eq('id', 'landing').single();
      if (!error && data) {
        doc = data.documento;
      }
    } else {
      doc = BO.getDoc('contenido', null);
    }

    const defaults = getInitialContent();
    if (!doc) return defaults;

    // Deep merge to ensure all keys exist
    return {
      hero: { ...defaults.hero, ...doc.hero },
      whatis: { ...defaults.whatis, ...doc.whatis },
      experience: { ...defaults.experience, ...doc.experience },
      split: { ...defaults.split, ...doc.split },
      destinations: { ...defaults.destinations, ...doc.destinations },
      model: { ...defaults.model, ...doc.model },
      landowners: { ...defaults.landowners, ...doc.landowners },
      process: { ...defaults.process, ...doc.process },
      partners: { ...defaults.partners, ...doc.partners },
      guests: { ...defaults.guests, ...doc.guests },
      footer: { ...defaults.footer, ...doc.footer }
    };
  },

  async update(documento: LandingContent): Promise<LandingContent> {
    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().from('contenido').upsert({ id: 'landing', documento }).select().single();
      if (error) throw error;
      return data.documento as LandingContent;
    }
    BO.setDoc('contenido', documento);
    return documento;
  }
};
