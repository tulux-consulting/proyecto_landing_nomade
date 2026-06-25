import { BO } from '../../lib/store.js';
import { NOMADE_ES, NOMADE_EN } from '../../data/content.js';
import { LandingContent } from './contenido.types';
import { createClient } from '../../lib/supabase/client';

const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';
const getSupabase = () => createClient();

function getInitialContent(locale: string = 'es'): LandingContent {
  const N = (locale === 'en' ? NOMADE_EN : NOMADE_ES) as any;
  if (locale === 'en') {
    return {
      hero: {
        imagen: N.hero.imagen || N.hero.img || "",
        eyebrow: "A hospitality network",
        titulo: "Extraordinary experiences. Consistent standards.",
        subtitulo: "Each destination is unique. The NÓMADE experience is not.",
        lead: "We are building a network of lodging and wellness experiences in carefully selected locations.",
        cta: "Discover NÓMADE"
      },
      whatis: {
        eyebrow: "What is NÓMADE",
        h2: "A hospitality brand, not a place.",
        lead: "NÓMADE is a network of hospitality and wellness destinations. We choose exceptional locations and turn them into memorable experiences, faithful to the same standard.",
        points: [
          { icon: "compass", h: "Hospitality first", p: "We do not sell lodging. We create curated experiences, from start to finish." },
          { icon: "map", h: "Curated destinations", p: "Each location is hand-picked for its character, surroundings, and potential." },
          { icon: "badge-check", h: "A consistent experience", p: "Wherever you are, the NÓMADE promise feels just as good." },
          { icon: "waypoints", h: "A growing network", p: "A long-term vision: a network of destinations that expands, slowly and with criteria." }
        ]
      },
      experience: {
        eyebrow: "The NÓMADE Experience",
        h2: "Thought for those who live it.",
        lead: "Everything we do exists for one thing: how you feel when you are there. Six principles that travel with you to each destination.",
        img: N.experience.img || "",
        pillars: [
          { icon: "drafting-compass", h: "Design", p: "Serene spaces that elevate the place instead of competing with it." },
          { icon: "flower-2", h: "Wellness", p: "Time to slow down. Rest, nature, and silence as a starting point." },
          { icon: "shield", h: "Privacy", p: "Your own places, far from the noise. The feeling of having the landscape to yourself." },
          { icon: "hand-heart", h: "Hospitality", p: "Attentive and discreet service, capable of anticipating what you need." },
          { icon: "map", h: "Local identity", p: "Each destination tastes of its land: its culture, its people, its flavors." },
          { icon: "badge-check", h: "Consistency", p: "The location changes. The level of the experience, never." }
        ],
        statement: ["The location changes.", "The NÓMADE experience does not."]
      },
      split: {
        eyebrow: "Three ways to join",
        h2: "How do you want to explore NÓMADE?",
        lead: "You already know what it is and what experience it creates. Choose the path that represents you.",
        options: [
          {
            kicker: "Potential",
            imagen: N.split.left?.img || "",
            h: "I have a location with potential",
            p: "You own a place with character and want to convert it into a destination, in partnership with NÓMADE — without building or managing anything.",
            cta: "I want to be part",
            target: "propietarios"
          },
          {
            kicker: "Partner",
            imagen: N.split.middle?.img || "",
            h: "I already operate an establishment",
            p: "You have a camping, glamping, winery, or lodging underway and want to add the NÓMADE brand, standards, and guest network.",
            cta: "I want to be a Partner",
            target: "socios"
          },
          {
            kicker: "Experience",
            imagen: N.split.right?.img || "",
            h: "I want to discover NÓMADE",
            p: "You dream of escaping to a cared-for destination, in the middle of nature. Get to know the experience and find out first when we open new locations.",
            cta: "Discover the experience",
            target: "destinos"
          }
        ]
      },
      destinations: {
        eyebrow: "Destinations worth discovering",
        h2: "We look for potential, not postcards.",
        lead: "A NÓMADE destination can be born in many landscapes. What they have in common is not the type of terrain, but its potential to become an unforgettable experience.",
        types: [
          { img: N.destinations.types?.[0]?.img || "", cap: "Mountains" },
          { img: N.destinations.types?.[1]?.img || "", cap: "Vineyards" },
          { img: N.destinations.types?.[2]?.img || "", cap: "Forests" },
          { img: N.destinations.types?.[3]?.img || "", cap: "Lakes" },
          { img: N.destinations.types?.[4]?.img || "", cap: "Countryside & ranches" },
          { img: N.destinations.types?.[5]?.img || "", cap: "Rural and cultural settings" }
        ],
        note: "Conceptual images that illustrate the type of potential we look for. NÓMADE does not yet have operating destinations.",
        mapEyebrow: "Regions in exploration",
        mapH: "Where we are looking.",
        mapLead: "We start with a few regions. The network will grow slowly, in a limited number of destinations.",
        disclaimer: "Regions of interest for future openings. Under exploration.",
        terrain: N.destinations.terrain || "",
        regions: N.destinations.regions || {}
      },
      model: {
        eyebrow: "The model",
        h2: "How a NÓMADE destination is born.",
        lead: "The formula is simple. A place with potential, our hospitality brand, and a shared standard. The result is a new destination within the network.",
        parts: [
          { icon: "mountain", h: "Landowners", p: "Provide a location with experiential potential." },
          { icon: "compass", h: "NÓMADE", p: "Provides the vision, design, and hospitality operation." },
          { icon: "badge-check", h: "Standards", p: "Consistent design and hospitality throughout the network." }
        ],
        result: { h: "A new destination", p: "A memorable experience, added to the NÓMADE network." }
      },
      landowners: {
        eyebrow: "For landowners",
        h2: "Do you have a place with potential?",
        lead: "If your land has something that makes it special, it could become a NÓMADE destination. You provide the place; we provide the vision, design, operation, and network — without you having to build or manage anything.",
        img: N.landowners.img || "",
        qualifies: {
          h: "What we look for",
          items: [
            "An environment with character: mountain, forest, lake, vineyard, hill, coast, or field.",
            "Reasonable access during a good part of the year.",
            "Views, water, vegetation, or attractions that make the place unique.",
            "Willingness to build something long-term, in partnership."
          ]
        },
        disqualifies: {
          h: "What is not for us",
          items: [
            "Urban subdivisions or purely residential land.",
            "Places without any natural, cultural, or scenic appeal.",
            "Projects seeking a quick land sale.",
            "Large-scale mass resort operations."
          ]
        },
        benefits: [
          { icon: "trending-up", h: "Value that lasts", p: "A well-made destination creates value that grows with the years." },
          { icon: "badge-check", h: "No management on your part", p: "NÓMADE designs, develops, and operates. You manage nothing." },
          { icon: "heart-handshake", h: "A partnership, not a sale", p: "You remain the owner. We grow together, with a clear and long-term model." }
        ],
        cta: "Submit my land"
      },
      process: {
        eyebrow: "The selection process",
        h2: "From application to the network.",
        lead: "A clear path without rush. Each place is evaluated individually; not all move forward, and that is fine.",
        steps: [
          { n: "01", icon: "send", h: "Application", p: "You share your land and what makes it unique through the form." },
          { n: "02", icon: "search", h: "Evaluation", p: "We analyze the landscape, access, and vocation of the place." },
          { n: "03", icon: "clipboard-check", h: "Feasibility", p: "We study technical, legal, and hospitality viability." },
          { n: "04", icon: "drafting-compass", h: "Development", p: "We design the proposal and shape the experience." },
          { n: "05", icon: "waypoints", h: "Integration to network", p: "The destination opens and joins the NÓMADE network." }
        ]
      },
      partners: {
        eyebrow: "NÓMADE Partners",
        h2: "Do you already operate a tourist establishment?",
        lead: "If you already have a project underway, you can join the network without starting from scratch. We bring our brand, standards, and guest network to establishments that share our vision of hospitality.",
        audiences: [
          { icon: "tent", h: "Campings & glampings" },
          { icon: "compass", h: "Tour operators" },
          { icon: "grape", h: "Vineyards & wineries" },
          { icon: "trees", h: "Rural hospitality" },
          { icon: "mountain", h: "Recreational properties" },
          { icon: "fuel", h: "Service stations" }
        ],
        value: [
          { h: "A brand that travels", p: "You add the backing and consistency of NÓMADE to what you have already built." },
          { h: "Access to the network", p: "You reach a community of guests looking for experiences like yours." },
          { h: "Shared standards", p: "Aligned design, service, and hospitality, without losing your identity." }
        ],
        cta: "Join as a Partner"
      },
      guests: {
        eyebrow: "For future guests",
        h2: "We are building the next NÓMADE destinations.",
        lead: "Be one of the first people to find out when we open new locations.",
        placeholder: "Your email",
        cta: "Notify me",
        success: "Done. We'll let you know when we open the first destinations.",
        note: "No spam. Only updates about new openings."
      },
      footer: {
        tagline: "A hospitality and wellness network. Extraordinary experiences, consistent standards, in carefully selected locations.",
        copyright: "© 2026 NÓMADE — all rights reserved."
      }
    };
  }

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
          kicker: N.split.middle?.kicker || "",
          imagen: N.split.middle?.img || "",
          h: N.split.middle?.h || "",
          p: N.split.middle?.p || "",
          cta: N.split.middle?.cta || "",
          target: N.split.middle?.target || ""
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
  // Helper to extract a single language structure from a database response
  _extractLocaleContent(doc: any, locale: string = 'es'): LandingContent {
    const defaults = getInitialContent(locale);
    if (!doc) return defaults;

    // Check if doc is the new multi-locale structure
    const localized = doc[locale] || (locale === 'es' && !doc.es && !doc.en ? doc : null);
    if (!localized) return defaults;

    return {
      hero: { ...defaults.hero, ...localized.hero },
      whatis: { ...defaults.whatis, ...localized.whatis },
      experience: { ...defaults.experience, ...localized.experience },
      split: { ...defaults.split, ...localized.split },
      destinations: { ...defaults.destinations, ...localized.destinations },
      model: { ...defaults.model, ...localized.model },
      landowners: { ...defaults.landowners, ...localized.landowners },
      process: { ...defaults.process, ...localized.process },
      partners: { ...defaults.partners, ...localized.partners },
      guests: { ...defaults.guests, ...localized.guests },
      footer: { ...defaults.footer, ...localized.footer }
    };
  },

  // Helper to merge a locale specific LandingContent into the full multi-locale object
  _mergeLocaleContent(currentDoc: any, localizedDoc: LandingContent, locale: string = 'es'): any {
    let base: any = {};
    if (currentDoc) {
      if (currentDoc.es || currentDoc.en) {
        base = { ...currentDoc };
      } else {
        // Convert old structure to new structure
        base = {
          es: { ...currentDoc },
          en: getInitialContent('en')
        };
      }
    } else {
      base = {
        es: getInitialContent('es'),
        en: getInitialContent('en')
      };
    }

    // Set the edited document in the target locale
    const newDoc = { ...localizedDoc };
    base[locale] = newDoc;

    // List of all locales to sync non-translatable properties to
    const locales = ['es', 'en'];
    const otherLocales = locales.filter(l => l !== locale);

    for (const other of otherLocales) {
      if (!base[other]) {
        base[other] = getInitialContent(other);
      }
      const otherDoc = { ...base[other] };

      // 1. Sync global images (hero image, experience image, landowners image)
      if (newDoc.hero) {
        otherDoc.hero = { ...otherDoc.hero, imagen: newDoc.hero.imagen };
      }
      if (newDoc.experience) {
        otherDoc.experience = { ...otherDoc.experience, img: newDoc.experience.img || (newDoc.experience as any).imagen || "" };
      }
      if (newDoc.landowners) {
        otherDoc.landowners = { ...otherDoc.landowners, img: newDoc.landowners.img || (newDoc.landowners as any).imagen || "" };
      }

      // 2. What Is Nomade (Points - sync quantity and the 'icon' field)
      if (newDoc.whatis && newDoc.whatis.points) {
        const otherPoints = Array.isArray(otherDoc.whatis.points) ? [...otherDoc.whatis.points] : [];
        const newPoints = newDoc.whatis.points.map((pt: any, idx: number) => {
          const oldPt = otherPoints[idx] || { h: "", p: "" };
          return {
            ...oldPt,
            icon: pt.icon
          };
        });
        otherDoc.whatis = { ...otherDoc.whatis, points: newPoints };
      }

      // 3. Experience Pillars (Pillars - sync quantity and the 'icon' field)
      if (newDoc.experience && newDoc.experience.pillars) {
        const otherPillars = Array.isArray(otherDoc.experience.pillars) ? [...otherDoc.experience.pillars] : [];
        const newPillars = newDoc.experience.pillars.map((pi: any, idx: number) => {
          const oldPi = otherPillars[idx] || { h: "", p: "" };
          return {
            ...oldPi,
            icon: pi.icon
          };
        });
        otherDoc.experience = { ...otherDoc.experience, pillars: newPillars };
      }

      // 4. Split (Options - sync quantity, 'imagen', and 'target')
      if (newDoc.split && newDoc.split.options) {
        const otherOptions = Array.isArray(otherDoc.split.options) ? [...otherDoc.split.options] : [];
        const newOptions = newDoc.split.options.map((opt: any, idx: number) => {
          const oldOpt = otherOptions[idx] || { kicker: "", h: "", p: "", cta: "" };
          return {
            ...oldOpt,
            imagen: opt.imagen,
            target: opt.target
          };
        });
        otherDoc.split = { ...otherDoc.split, options: newOptions };
      }

      // 5. Destinations (Types - sync quantity and 'img')
      if (newDoc.destinations && newDoc.destinations.types) {
        const otherTypes = Array.isArray(otherDoc.destinations.types) ? [...otherDoc.destinations.types] : [];
        const newTypes = newDoc.destinations.types.map((t: any, idx: number) => {
          const oldT = otherTypes[idx] || { cap: "" };
          return {
            ...oldT,
            img: t.img
          };
        });
        otherDoc.destinations = { ...otherDoc.destinations, types: newTypes };
      }

      // 6. The Process (Steps - sync quantity, 'n', and 'icon')
      if (newDoc.process && newDoc.process.steps) {
        const otherSteps = Array.isArray(otherDoc.process.steps) ? [...otherDoc.process.steps] : [];
        const newSteps = newDoc.process.steps.map((st: any, idx: number) => {
          const oldSt = otherSteps[idx] || { h: "", p: "" };
          return {
            ...oldSt,
            n: st.n,
            icon: st.icon
          };
        });
        otherDoc.process = { ...otherDoc.process, steps: newSteps };
      }

      // 7. Partners (Value - sync quantity only, fields blank)
      if (newDoc.partners && newDoc.partners.value) {
        const otherValues = Array.isArray(otherDoc.partners.value) ? [...otherDoc.partners.value] : [];
        const newValues = newDoc.partners.value.map((v: any, idx: number) => {
          return otherValues[idx] || { h: "", p: "" };
        });
        otherDoc.partners = { ...otherDoc.partners, value: newValues };
      }

      base[other] = otherDoc;
    }

    return base;
  },

  async getDraft(locale: string = 'es'): Promise<LandingContent> {
    let doc: any = null;

    if (USE_SUPABASE) {
      const { data, error } = await getSupabase()
        .from('contenido')
        .select('draft_content')
        .eq('id', 'landing')
        .maybeSingle();
      if (!error && data) {
        doc = data.draft_content;
      }
    } else {
      doc = BO.getDoc('contenido_draft', null);
    }

    return this._extractLocaleContent(doc, locale);
  },

  async getPublished(locale: string = 'es'): Promise<LandingContent> {
    let doc: any = null;

    if (USE_SUPABASE) {
      const { data, error } = await getSupabase().rpc('get_published_content');
      if (!error && data) {
        doc = data;
      }
    } else {
      doc = BO.getDoc('contenido_published', null);
    }

    return this._extractLocaleContent(doc, locale);
  },

  async updateDraft(documento: LandingContent, locale: string = 'es'): Promise<LandingContent> {
    let currentDoc: any = null;

    if (USE_SUPABASE) {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;

      // Fetch current document first to merge
      const { data: existing } = await supabase
        .from('contenido')
        .select('draft_content')
        .eq('id', 'landing')
        .maybeSingle();

      currentDoc = existing?.draft_content || null;
      const mergedDoc = this._mergeLocaleContent(currentDoc, documento, locale);

      const { data, error } = await supabase
        .from('contenido')
        .upsert({
          id: 'landing',
          draft_content: mergedDoc,
          updated_at: new Date().toISOString(),
          updated_by: userId
        })
        .select()
        .single();
      if (error) throw error;
      return this._extractLocaleContent(data.draft_content, locale);
    } else {
      currentDoc = BO.getDoc('contenido_draft', null);
      const mergedDoc = this._mergeLocaleContent(currentDoc, documento, locale);
      BO.setDoc('contenido_draft', mergedDoc);
      return documento;
    }
  },

  async publish(documento: LandingContent, locale: string = 'es'): Promise<LandingContent> {
    let currentDraft: any = null;
    let currentPub: any = null;

    if (USE_SUPABASE) {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;
      const now = new Date().toISOString();

      const { data: existing } = await supabase
        .from('contenido')
        .select('draft_content, published_content')
        .eq('id', 'landing')
        .maybeSingle();

      currentDraft = existing?.draft_content || null;
      currentPub = existing?.published_content || null;

      const mergedDraft = this._mergeLocaleContent(currentDraft, documento, locale);
      const mergedPub = this._mergeLocaleContent(currentPub, documento, locale);

      const { data, error } = await supabase
        .from('contenido')
        .upsert({
          id: 'landing',
          draft_content: mergedDraft,
          published_content: mergedPub,
          updated_at: now,
          last_published_at: now,
          updated_by: userId,
          published_by: userId
        })
        .select()
        .single();
      if (error) throw error;
      return this._extractLocaleContent(data.published_content, locale);
    } else {
      currentDraft = BO.getDoc('contenido_draft', null);
      currentPub = BO.getDoc('contenido_published', null);

      const mergedDraft = this._mergeLocaleContent(currentDraft, documento, locale);
      const mergedPub = this._mergeLocaleContent(currentPub, documento, locale);

      BO.setDoc('contenido_draft', mergedDraft);
      BO.setDoc('contenido_published', mergedPub);
      return documento;
    }
  },

  async get(locale: string = 'es'): Promise<LandingContent> {
    return this.getDraft(locale);
  },

  async update(documento: LandingContent, locale: string = 'es'): Promise<LandingContent> {
    return this.publish(documento, locale);
  }
};
