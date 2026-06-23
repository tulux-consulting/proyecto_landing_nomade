import { NOMADE } from '../data/content.js';

const PREFIX = "nomade_mem_v2_";

function uid(p?: string) {
  return (p || "id") + "_" + Math.random().toString(36).slice(2, 9);
}

function nowISO(daysAgo?: number) {
  const d = new Date();
  if (daysAgo) d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// Memory Database synced with LocalStorage for reload persistence
class MemoryDatabase {
  constructor() {
    this.seed();
  }

  private readStorage(key: string, fallback: any): any {
    try {
      if (typeof window === 'undefined') return fallback;
      const r = localStorage.getItem(PREFIX + key);
      return r ? JSON.parse(r) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  private writeStorage(key: string, val: any): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PREFIX + key, JSON.stringify(val));
    } catch (e) {}
  }

  public all(col: string): any[] {
    return this.readStorage(col, []);
  }

  public get(col: string, id: string): any | null {
    return this.all(col).find((r) => r.id === id) || null;
  }

  public insert(col: string, rec: any): any {
    const list = this.all(col);
    const newRec = {
      ...rec,
      id: rec.id || uid(col),
      fecha: rec.fecha || nowISO(0),
      created_at: rec.created_at || nowISO(0),
      updated_at: rec.updated_at || nowISO(0)
    };
    list.unshift(newRec);
    this.writeStorage(col, list);
    return newRec;
  }

  public update(col: string, id: string, patch: any): any {
    const list = this.all(col).map((r) => {
      if (r.id === id) {
        return {
          ...r,
          ...patch,
          updated_at: nowISO(0)
        };
      }
      return r;
    });
    this.writeStorage(col, list);
    return this.get(col, id);
  }

  public remove(col: string, id: string): void {
    const list = this.all(col).filter((r) => r.id !== id);
    this.writeStorage(col, list);
  }

  public getDoc(key: string, fallback: any): any {
    return this.readStorage(key, fallback);
  }

  public setDoc(key: string, val: any): void {
    this.writeStorage(key, val);
  }

  public seed() {
    if (typeof window === 'undefined') return;
    if (this.readStorage('seeded', false)) return;
    this.writeStorage('seeded', true);

    // — POSTULACIONES (terrenos) —
    const PROVS = ["Buenos Aires", "Río Negro", "Mendoza", "Córdoba", "Neuquén", "Salta", "Chubut", "Tierra del Fuego", "Misiones", "San Juan", "Santa Fe", "Tucumán"];
    const ESTADOS = ["Nuevo", "Pendiente de revisión", "Contactado", "En negociación", "Aprobado", "Rechazado"];
    const FOTOS_POOL = ["1501785888041-af3ef285b470", "1470071459604-3b5ec3a7fe05", "1500382017468-9049fed747ef", "1426604966848-d7adac402bff", "1454496522488-7a8e488e8606", "1469474968028-56623f02e42e", "1472396961693-142e6e269027", "1433086966358-54859d0ed716", "1518495973542-4542c06a5843", "1441974231531-c6227db76b6e"];
    const RELACIONES = ["Propietario", "Copropietario", "Representante / Apoderado", "Sociedad"];
    const TOPOS = ["Llano", "Ondulado", "Montañoso", "Mixto", "Con pendiente pronunciada"];
    const ACCESO_TIPO = ["Ruta asfaltada", "Camino de ripio", "Camino de tierra", "Huella / sendero"];
    const ACCESO_DISP = ["Todo el año", "Estacional (verano)", "Limitado en invierno por nieve"];
    const USO_SUELO = ["Rural", "Rural turístico", "Mixto", "Sin restricción de uso"];
    const SERVICIOS_POOL = ["Electricidad de red", "Agua de vertiente", "Pozo de agua", "Internet satelital", "Señal de celular", "Sin servicios cercanos", "Energía solar instalada"];
    const DEMANDAS = ["Alta — destino turístico consolidado", "Media — en crecimiento", "Incipiente — sin desarrollar"];
    const INVERSIONES = ["No, solo aporto la tierra", "Hasta USD 50.000", "USD 50.000 – 150.000", "Más de USD 150.000", "A definir según el proyecto"];
    const HORIZONTES = ["Corto plazo (este año)", "Mediano plazo (1–2 años)", "Largo plazo (sin apuro)"];
    
    const pick = (arr: any[], i: number) => arr[i % arr.length];
    
    const richPost = (r: any, i: number) => {
      const fa = FOTOS_POOL[i % FOTOS_POOL.length];
      const fb = FOTOS_POOL[(i + 3) % FOTOS_POOL.length];
      const fc = FOTOS_POOL[(i + 6) % FOTOS_POOL.length];
      const nFotos = (i % 4 === 0) ? 4 : (i % 3 === 0 ? 2 : 3);
      const fotos = [fa, fb, fc, FOTOS_POOL[(i + 1) % FOTOS_POOL.length]].slice(0, nFotos);
      return {
        relacion: pick(RELACIONES, i),
        mapsLink: (i % 3 === 0) ? "" : "https://maps.google.com/?q=" + (-34 - (i % 12)) + "." + (100 + i) + ",-" + (62 + (i % 8)) + "." + (200 + i),
        distanciaCiudad: (8 + (i * 7) % 95) + " km a " + r[3],
        topografia: pick(TOPOS, i),
        cuerpoAgua: (r[5] || [])[0] || "Sin cuerpo de agua",
        vistas: ["Montaña y valle", "Lago y bosque", "Sierras al atardecer", "Viñedos y cordillera", "Selva y saltos de agua", "Estepa y cielo abierto"][i % 6],
        vegetacion: ["Bosque nativo de coihues y arrayanes", "Arboleda madura y pastizal", "Monte bajo y especies autóctonas", "Viñedo y olivos", "Selva paranaense densa", "Vegetación de altura, baja y resistente"][i % 6],
        accesoTipo: pick(ACCESO_TIPO, i),
        accesoDisp: pick(ACCESO_DISP, i),
        servicios: (i % 5 === 0) ? [SERVICIOS_POOL[5]] : [SERVICIOS_POOL[i % 5], SERVICIOS_POOL[(i + 2) % 5], (i % 2 ? SERVICIOS_POOL[6] : SERVICIOS_POOL[3])].filter(Boolean),
        construcciones: (i % 4 === 0) ? "Sin construcciones" : ["Casa principal a refaccionar", "Galpón y corral de piedra", "Antigua casa de adobe", "Refugio de montaña existente"][i % 4],
        legal: {
          titulo: (i % 6 === 5) ? "En sucesión" : "Escritura a nombre del postulante",
          usoSuelo: pick(USO_SUELO, i),
          restricciones: (i % 3 === 0) ? "Lindante a área natural protegida — requiere estudio." : "Sin restricciones ambientales conocidas.",
          observaciones: (i % 2 === 0) ? "" : "Servidumbre de paso registrada sobre el camino de acceso."
        },
        turismo: {
          actividades: [["Trekking", "Kayak", "Observación de aves"], ["Cicloturismo", "Cabalgatas"], ["Astroturismo", "Trekking"], ["Enoturismo", "Gastronomía"], ["Avistaje de fauna", "Fotografía"], ["Pesca", "Navegación"]][i % 6],
          atractivos: ["Parque Nacional a 20 min", "Pueblo de montaña cercano", "Ruta del vino regional", "Cataratas y saltos", "Reserva natural lindante", "Centro de esquí en temporada"][i % 6],
          demanda: pick(DEMANDAS, i)
        },
        participacion: {
          modelo: r[6],
          inversion: pick(INVERSIONES, i),
          horizonte: pick(HORIZONTES, i)
        },
        fotos: fotos,
        documentos: (i % 3 === 0) ? [] : [{ nombre: "Plano catastral.pdf", tipo: "PDF" }, { nombre: "Título de propiedad.pdf", tipo: "PDF" }].slice(0, (i % 2) + 1)
      };
    };

    const postRaw = [
      ["Martina", "Echeverría", "Río Negro", "Villa La Angostura", "5 – 20 ha", ["Lago", "Bosque"], "Aporte de tierra en sociedad", "En negociación", 2, "Península sobre el lago Nahuel Huapi, bosque de coihues, costa propia de 200 m."],
      ["Tomás", "Lagos", "Mendoza", "Valle de Uco", "20 – 100 ha", ["Viñedo", "Montaña"], "Aporte de tierra en sociedad", "Aprobado", 9, "Viñedo en producción con vista a los Andes, casa principal a refaccionar."],
      ["Carolina", "Méndez", "Córdoba", "Villa General Belgrano", "1 – 5 ha", ["Sierra", "Río o arroyo"], "Arrendamiento de largo plazo", "Contactado", 4, "Arroyo de agua clara cruzando el terreno, arboleda madura."],
      ["Federico", "Sosa", "Salta", "Cafayate", "5 – 20 ha", ["Viñedo", "Desierto"], "Abierto a evaluar", "Nuevo", 0, "Entre viñedos de altura, cielos limpios, ideal para astroturismo."],
      ["Lucía", "Paredes", "Neuquén", "San Martín de los Andes", "20 – 100 ha", ["Lago", "Montaña"], "Aporte de tierra en sociedad", "Pendiente de revisión", 1, "Ladera con vista al lago Lácar, acceso por ruta provincial."],
      ["Ignacio", "Ferrari", "Chubut", "Lago Puelo", "5 – 20 ha", ["Lago", "Bosque"], "Venta", "Rechazado", 21, "Loteo cercano, sin atractivo diferencial — no califica para la red."],
      ["Valentina", "Ríos", "Tierra del Fuego", "Tolhuin", "100 ha", ["Bosque", "Lago"], "Aporte de tierra en sociedad", "Nuevo", 0, "Bosque fueguino a orillas del lago Fagnano, total privacidad."],
      ["Joaquín", "Bravo", "Buenos Aires", "Tandil", "20 – 100 ha", ["Sierra", "Campo"], "Arrendamiento de largo plazo", "Contactado", 6, "Sierras bonaerenses, afloramientos de piedra, campo abierto."],
      ["Sofía", "Domínguez", "San Juan", "Barreal", "Más de 100 ha", ["Montaña", "Desierto"], "Abierto a evaluar", "Pendiente de revisión", 3, "Pampa de altura con vista al cordón de Ansilta, cielo de los más limpios del país."],
      ["Andrés", "Quiroga", "Misiones", "El Soberbio", "5 – 20 ha", ["Bosque", "Río o arroyo"], "Aporte de tierra en sociedad", "Nuevo", 0, "Selva paranaense, saltos de agua, lindante a área protegida."],
      ["Camila", "Núñez", "Mendoza", "Tunuyán", "1 – 5 ha", ["Viñedo"], "Venta", "En negociación", 12, "Pequeña finca con olivos y vid, casa de adobe restaurada."],
      ["Diego", "Acosta", "Córdoba", "La Cumbrecita", "1 – 5 ha", ["Sierra", "Bosque"], "Arrendamiento de largo plazo", "Aprobado", 15, "Pueblo peatonal de montaña, bosque de coníferas, arroyo lindero."]
    ];

    const post = postRaw.map((r, i) => {
      const emailNormalized = (r[0] + "." + r[1]).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "@gmail.com";
      const tel = "+54 9 " + (290 + Math.floor(Math.random() * 80)) + " " + (400 + Math.floor(Math.random() * 599)) + "-" + (1000 + Math.floor(Math.random() * 8999));
      return {
        id: uid("post"),
        fecha: nowISO(r[8] as number),
        created_at: nowISO(r[8] as number),
        nombre: r[0],
        apellido: r[1],
        email: emailNormalized,
        telefono: tel,
        provincia: r[2],
        localidad: r[3],
        tamano: r[4],
        paisaje: r[5],
        modelo: r[6],
        estado: r[7],
        archivado: false,
        comentarios: r[9],
        notas: [],
        ...richPost(r, i)
      };
    });
    this.writeStorage('postulaciones', post);

    // — PARTNERS (establecimientos) —
    const partRaw = [
      ["Refugio del Lago", "Glamping", "Río Negro", "Bariloche", "Aprobado", 14, "8 domos sobre el lago, en operación hace 3 años. Marca consolidada localmente."],
      ["Bodega Tierra Alta", "Viñedo / Bodega", "Mendoza", "Luján de Cuyo", "En negociación", 6, "Bodega boutique con restaurante; busca sumar hospedaje de la mano de NÓMADE."],
      ["Camping Los Alerces", "Camping", "Chubut", "Esquel", "Contactado", 9, "Camping tradicional dentro del corredor de los Alerces, quiere elevar su propuesta."],
      ["Estancia La Federada", "Hospitalidad rural", "Buenos Aires", "San Antonio de Areco", "Nuevo", 0, "Casco histórico, cabalgatas y gastronomía de campo."],
      ["Andes Expediciones", "Operador turístico", "Mendoza", "Uspallata", "Pendiente de revisión", 2, "Operador de trekking y montañismo, quiere integrar alojamiento NÓMADE."],
      ["Posada del Viñedo", "Viñedo / Bodega", "Salta", "Cafayate", "Nuevo", 1, "Pequeña posada entre viñedos de altura."],
      ["Glamping Selva Viva", "Glamping", "Misiones", "Puerto Iguazú", "Contactado", 7, "Carpas de lujo cerca de las cataratas, alta ocupación todo el año."],
      ["Casa de Campo El Ombú", "Propiedad recreativa", "Córdoba", "Mina Clavero", "Rechazado", 25, "Propiedad sin diferencial experiencial; no alinea con la red."],
      ["Patagonia Wild Lodge", "Hospitalidad rural", "Santa Cruz", "El Chaltén", "En negociación", 4, "Lodge de montaña con vista al Fitz Roy, marca con buena reputación."]
    ];

    const part = partRaw.map((r, i) => {
      return {
        id: uid("part"),
        fecha: nowISO(r[5] as number),
        created_at: nowISO(r[5] as number),
        nombre: r[0],
        tipo: r[1],
        fiscal: "30-" + (60000000 + Math.floor(Math.random() * 9000000)) + "-" + Math.floor(Math.random() * 9),
        provincia: r[2],
        localidad: r[3],
        telefono: "+54 9 " + (290 + Math.floor(Math.random() * 80)) + " " + (400 + Math.floor(Math.random() * 599)) + "-" + (1000 + Math.floor(Math.random() * 8999)),
        email: "contacto@" + (r[0] as string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") + ".com",
        web: (i % 3 === 0) ? "" : "https://" + (r[0] as string).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") + ".com",
        capacidad: (4 + (i * 3) % 30) + " plazas",
        anosOperando: (i % 6),
        estado: r[4],
        archivado: false,
        descripcion: r[6],
        notas: []
      };
    });
    this.writeStorage('partners', part);

    // — HUÉSPEDES (lista de espera) —
    const GEO = [
      ["Argentina", "Buenos Aires", "CABA"], ["Argentina", "Buenos Aires", "La Plata"], ["Argentina", "Córdoba", "Córdoba"],
      ["Argentina", "Mendoza", "Mendoza"], ["Argentina", "Santa Fe", "Rosario"], ["Argentina", "Río Negro", "Bariloche"],
      ["Argentina", "Neuquén", "Neuquén"], ["Argentina", "Buenos Aires", "Mar del Plata"], ["Argentina", "Tucumán", "San Miguel"],
      ["Chile", "Región Metropolitana", "Santiago"], ["Uruguay", "Montevideo", "Montevideo"], ["España", "Madrid", "Madrid"],
      ["Estados Unidos", "California", "San Francisco"], ["Brasil", "São Paulo", "São Paulo"]
    ];
    const NAVS = ["Chrome", "Safari", "Firefox", "Edge"];
    const SOS = ["iOS", "Android", "macOS", "Windows"];
    const DEVS = ["Móvil", "Escritorio", "Tablet"];
    const WEIGHTS = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 0, 0, 1, 1, 2, 5, 6, 0, 3, 0, 1, 1, 8, 9, 0, 2, 12];
    
    const hue = WEIGHTS.map((g, i) => {
      const loc = GEO[g % GEO.length];
      const dev = DEVS[Math.floor(Math.random() * (i % 3 === 0 ? 1 : 3))];
      const so = dev === "Móvil" ? (Math.random() > 0.5 ? "iOS" : "Android") : (Math.random() > 0.5 ? "macOS" : "Windows");
      return {
        id: uid("hue"),
        fecha: nowISO(Math.floor(Math.random() * 40)),
        created_at: nowISO(Math.floor(Math.random() * 40)),
        email: ["lucia", "mateo", "sofia", "joaquin", "valen", "nico", "flor", "tomas", "agus", "renata", "bruno", "delfi", "santi", "mora"][i % 14] + (10 + i) + "@gmail.com",
        pais: loc[0],
        provincia: loc[1],
        ciudad: loc[2],
        navegador: NAVS[Math.floor(Math.random() * NAVS.length)],
        so: so,
        dispositivo: dev,
        estado: 'Nuevo',
        admin_notes: ''
      };
    });
    this.writeStorage('huespedes', hue);

    // — DESTINOS —
    const COMPLEJOS = ["Complejo Arcoíris", "Refugio del Lago", "Domos del Valle", "Casa de Piedra", "Mirador de las Sierras", "Selva Adentro", "Cabañas del Fin del Mundo"];
    const destRaw = [
      ["Bariloche", "Río Negro · Lagos y bosque andino", "Disponible", "A orillas de un lago glaciar y rodeada de bosque andino, una casa de diseño donde el silencio y la montaña son los protagonistas.", "1501785888041-af3ef285b470"],
      ["Mendoza", "Cuyo · Viñedos y cordillera", "Disponible", "Entre viñedos y la silueta de los Andes, una casa pequeña pensada para el descanso lento.", "1500382017468-9049fed747ef"],
      ["El Bolsón", "Río Negro · Valle de montaña", "No disponible", "En un valle entre ríos y huertas, un refugio íntimo para desconectar del mundo.", "1470071459604-3b5ec3a7fe05"],
      ["Villa General Belgrano", "Córdoba · Sierras y arroyos", "No disponible", "En las sierras de Córdoba, junto a un arroyo de agua clara, un espacio sereno entre árboles.", "1426604966848-d7adac402bff"],
      ["Tandil", "Buenos Aires · Sierras y campo", "No disponible", "Sobre las sierras bonaerenses, entre campo abierto y piedra, un retiro luminoso lejos del ruido.", "1454496522488-7a8e488e8606"],
      ["Misiones", "Litoral · Selva y agua", "No disponible", "En el corazón de la selva, entre agua y vegetación intensa, un refugio que respira verde.", "1470071459604-3b5ec3a7fe05"],
      ["Ushuaia", "Tierra del Fuego · El fin del mundo", "No disponible", "En el fin del mundo, entre montañas nevadas y el canal Beagle, una casa para los viajeros del último confín.", "1469474968028-56623f02e42e"]
    ];

    const dest = destRaw.map((r, i) => {
      return {
        id: uid("dest"),
        fecha: nowISO(30 - i),
        created_at: nowISO(30 - i),
        nombre: r[0],
        complejo: COMPLEJOS[i % COMPLEJOS.length],
        ubicacion: r[1],
        estado: r[2],
        descripcion: r[3],
        imagen: r[4],
        fotos: [r[4], FOTOS_POOL[(i + 2) % FOTOS_POOL.length], FOTOS_POOL[(i + 5) % FOTOS_POOL.length]],
        reserva: r[2] === "Disponible" ? "https://www.airbnb.com/s/" + r[0].replace(/ /g, "-") + "--Argentina/homes" : "",
        archivado: false
      };
    });
    this.writeStorage('destinos', dest);

    // — USUARIOS (profiles) —
    const users = [
      { id: "usr_admin", nombre: "Administrador", email: "admin@nomade.com", username: "admin", role: "admin", activo: true, fecha: nowISO(120), created_at: nowISO(120) },
      { id: "usr_valeria", nombre: "Valeria Cano", email: "valeria@nomade.com", username: "valeria.cano", role: "operations", activo: true, fecha: nowISO(60), created_at: nowISO(60) },
      { id: "usr_martin", nombre: "Martín Reyes", email: "martin@nomade.com", username: "martin.reyes", role: "marketing", activo: true, fecha: nowISO(40), created_at: nowISO(40) },
      { id: "usr_paula", nombre: "Paula Giménez", email: "paula@nomade.com", username: "paula.gimenez", role: "sales", activo: false, fecha: nowISO(20), created_at: nowISO(20) }
    ];
    this.writeStorage('usuarios', users);

    // — CONTENIDO (CMS) —
    const N = NOMADE as any;
    const initialContent = {
      hero: {
        imagen: N.hero.imagen || N.hero.img || "",
        eyebrow: N.hero.eyebrow || "Una red de hospitalidad",
        titulo: N.hero.titulo || `${N.hero.h1a || ""} ${N.hero.h1b || ""}`.trim() || "Experiencias extraordinarias. Estándares consistentes.",
        subtitulo: N.hero.subtitulo || `${N.hero.sub1 || ""} ${N.hero.sub2 || ""}`.trim() || "Cada destino es único. La experiencia NÓMADE no.",
        lead: N.hero.lead || "Estamos construyendo una red de experiencias de alojamiento y bienestar en ubicaciones cuidadosamente seleccionadas.",
        cta: N.hero.cta || "Descubrir NÓMADE"
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

    this.writeStorage('contenido_draft', JSON.parse(JSON.stringify(initialContent)));
    this.writeStorage('contenido_published', JSON.parse(JSON.stringify(initialContent)));

    const settings = {
      panelNombre: "Panel NÓMADE",
      idioma: "Español (Argentina)",
      zonaHoraria: "America/Argentina/Buenos_Aires",
      notificaciones: { nuevaPostulacion: true, nuevoPartner: true, resumenSemanal: false }
    };
    this.writeStorage('ajustes', settings);
  }
}

export const MemoryDb = new MemoryDatabase();
