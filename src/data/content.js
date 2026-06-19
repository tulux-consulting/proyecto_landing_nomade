/* NÓMADE — public landing page content.
   NÓMADE is a HOSPITALITY BRAND. The product is the experience.
   Land is the mechanism used to expand the network; tiny houses / modular
   units are implementation details, never the value proposition.

   Three audiences, one linear narrative:
     · Landowners (primary)        → the opportunity + the application
     · Partners / operators (2nd)  → the business proposition
     · Future guests (tertiary)    → the waitlist

   No inventory, bookings, prices or reviews — the network is in formation.
   Imagery: Unsplash CDN placeholders (nature, golden hour). Swap for licensed photos. */
const IMG = (id, w) => (typeof window !== 'undefined' && window.__resources && window.__resources[id])
  || `https://images.unsplash.com/photo-${id}?w=${w || 1600}&q=80&auto=format&fit=crop`;
// Local (real) photography. Resolves to an inlined blob in the standalone build,
// otherwise to the project-relative path. data-resource-id must match `id`.
const LIMG = (path, id) => (typeof window !== 'undefined' && window.__resources && window.__resources[id]) || path;

export const NOMADE = {

  nav: {
    links: [
      ["Qué es NÓMADE", "que-es"],
      ["Experiencia", "experiencia"],
      ["Destinos", "destinos"],
      ["Partners", "socios"],
      ["Contacto", "contacto"]
    ],
    cta: "Postular ubicación"
  },

  // 1 — HERO
  hero: {
    img: IMG("1469474968028-56623f02e42e", 2200),
    eyebrow: "Una red de hospitalidad",
    h1a: "Experiencias extraordinarias.",
    h1b: "Estándares consistentes.",
    sub1: "Cada destino es único.",
    sub2: "La experiencia NÓMADE no.",
    lead: "Estamos construyendo una red de experiencias de alojamiento y bienestar en ubicaciones cuidadosamente seleccionadas.",
    cta: "Descubrir NÓMADE"
  },

  // 4.5 — AUDIENCE SELF-IDENTIFICATION (split). Comes after the vision is sold.
  split: {
    eyebrow: "Tres formas de sumarte",
    h2: "¿Cómo querés explorar NÓMADE?",
    lead: "Ya sabés qué es y qué experiencia crea. Elegí el camino que te representa.",
    left: {
      kicker: "Potencial",
      img: IMG("1426604966848-d7adac402bff", 1400),
      h: "Tengo una ubicación con potencial",
      p: "Sos dueño de un lugar con carácter y querés convertirlo en un destino, en alianza con NÓMADE — sin construir ni administrar nada.",
      cta: "Quiero ser parte",
      target: "propietarios"
    },
    middle: {
      kicker: "PARTNER",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1100&q=80&auto=format&fit=crop",
      h: "Ya opero un establecimiento",
      p: "Tenés un camping, glamping, viñedo u hospedaje en marcha y querés sumar la marca, los estándares y la red de huéspedes de NÓMADE.",
      cta: "Quiero ser Partner",
      target: "socios"
    },
    right: {
      kicker: "Experiencia",
      img: LIMG("/assets/photos/guest-doorway.jpg", "guestDoorway"),
      h: "Quiero descubrir NÓMADE",
      p: "Soñás con escaparte a un destino cuidado, en plena naturaleza. Conocé la experiencia y enterate primero cuando abramos nuevas ubicaciones.",
      cta: "Descubrir la experiencia",
      target: "destinos"
    }
  },

  // 3 — WHAT IS NÓMADE
  whatis: {
    eyebrow: "Qué es NÓMADE",
    h2: "Una marca de hospitalidad, no un lugar.",
    lead: "NÓMADE es una red de destinos de hospitalidad y bienestar. Elegimos ubicaciones excepcionales y las convertimos en experiencias memorables, fieles a un mismo estándar.",
    points: [
      { icon: "compass", h: "Hospitalidad primero", p: "No vendemos alojamiento. Creamos experiencias cuidadas, de principio a fin." },
      { icon: "map", h: "Destinos curados", p: "Cada ubicación se elige a mano por su carácter, su entorno y su potencial." },
      { icon: "badge-check", h: "Una experiencia consistente", p: "Dondequiera que estés, la promesa NÓMADE se siente igual de bien." },
      { icon: "waypoints", h: "Una red que crece", p: "Una visión de largo plazo: una red de destinos que se expande, despacio y con criterio." }
    ]
  },

  // 4 — THE NÓMADE EXPERIENCE (guest value)
  experience: {
    eyebrow: "La experiencia NÓMADE",
    h2: "Pensado para quien lo vive.",
    lead: "Todo lo que hacemos existe para una sola cosa: cómo te sentís cuando estás ahí. Seis principios que viajan con vos a cada destino.",
    img: LIMG("/assets/photos/interior-golden.jpg", "interiorGolden"),
    pillars: [
      { icon: "drafting-compass", h: "Diseño", p: "Espacios serenos que elevan el lugar en lugar de competir con él." },
      { icon: "flower-2", h: "Bienestar", p: "Tiempo para desacelerar. Descanso, naturaleza y silencio como punto de partida." },
      { icon: "shield", h: "Privacidad", p: "Lugares propios, lejos del ruido. La sensación de tener el paisaje para vos." },
      { icon: "hand-heart", h: "Hospitalidad", p: "Atención atenta y discreta, capaz de anticiparse a lo que necesitás." },
      { icon: "map", h: "Identidad local", p: "Cada destino sabe a su tierra: su cultura, su gente, sus sabores." },
      { icon: "badge-check", h: "Consistencia", p: "La ubicación cambia. El nivel de la experiencia, nunca." }
    ],
    statement: ["La ubicación cambia.", "La experiencia NÓMADE no."]
  },

  // 5 — DESTINATIONS WORTH DISCOVERING (potential, not "nature")
  destinations: {
    eyebrow: "Destinos que vale la pena descubrir",
    h2: "Buscamos potencial, no postales.",
    lead: "Un destino NÓMADE puede nacer en muchos paisajes. Lo que tienen en común no es el tipo de terreno, sino su potencial para convertirse en una experiencia inolvidable.",
    types: [
      { img: IMG("1469474968028-56623f02e42e", 1200), cap: "Montañas" },
      { img: IMG("1500382017468-9049fed747ef", 1200), cap: "Viñedos" },
      { img: IMG("1470071459604-3b5ec3a7fe05", 1200), cap: "Bosques" },
      { img: IMG("1501785888041-af3ef285b470", 1200), cap: "Lagos" },
      { img: IMG("1426604966848-d7adac402bff", 1200), cap: "Campo y estancias" },
      { img: IMG("1454496522488-7a8e488e8606", 1200), cap: "Entornos rurales y culturales" }
    ],
    note: "Imágenes conceptuales que ilustran el tipo de potencial que buscamos. NÓMADE aún no cuenta con destinos operativos.",
    // map block
    mapEyebrow: "Regiones en exploración",
    mapH: "Dónde estamos mirando.",
    mapLead: "Empezamos por unas pocas regiones. La red crecerá despacio, en un número acotado de destinos.",
    disclaimer: "Regiones de interés para futuras aperturas · en exploración.",
    terrain: IMG("1426604966848-d7adac402bff", 1400),
    regions: {
      "Bariloche": {
        geo: "Río Negro · Lagos y bosque andino",
        desc: "A orillas de un lago glaciar y rodeada de bosque andino, una tiny house de diseño donde el silencio y la montaña son los protagonistas. Madera cálida, grandes ventanales y la Patagonia a un paso de la puerta.",
        photos: [IMG("1501785888041-af3ef285b470", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/interior-golden.jpg", "interiorGolden")],
        book: "https://www.airbnb.com/s/Bariloche--Argentina/homes"
      },
      "El Bolsón": {
        geo: "Río Negro · Valle de montaña",
        desc: "En un valle entre ríos y huertas, un refugio íntimo para desconectar del mundo. Amanecés con aroma a bosque y la cordillera enmarcando cada ventana.",
        photos: [IMG("1470071459604-3b5ec3a7fe05", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/guest-doorway.jpg", "guestDoorway")],
        book: "https://www.airbnb.com/s/El-Bolson--Argentina/homes"
      },
      "Mendoza": {
        geo: "Cuyo · Viñedos y cordillera",
        desc: "Entre viñedos y la silueta de los Andes, una casa pequeña pensada para el descanso lento. Atardeceres de vino, cielos enormes y el confort silencioso de NÓMADE.",
        photos: [IMG("1500382017468-9049fed747ef", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/interior-golden.jpg", "interiorGolden")],
        book: "https://www.airbnb.com/s/Mendoza--Argentina/homes"
      },
      "Villa General Belgrano": {
        geo: "Córdoba · Sierras y arroyos",
        desc: "En las sierras de Córdoba, junto a un arroyo de agua clara, un espacio sereno entre árboles. El sonido del agua, senderos cercanos y la calidez de un diseño hecho para habitar la naturaleza.",
        photos: [IMG("1426604966848-d7adac402bff", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/guest-doorway.jpg", "guestDoorway")],
        book: "https://www.airbnb.com/s/Villa-General-Belgrano--Argentina/homes"
      },
      "Tandil": {
        geo: "Buenos Aires · Sierras y campo",
        desc: "Sobre las sierras bonaerenses, entre campo abierto y piedra, un retiro luminoso lejos del ruido. Mañanas de niebla, caminatas y el lujo simple de no tener apuro.",
        photos: [IMG("1454496522488-7a8e488e8606", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/interior-golden.jpg", "interiorGolden")],
        book: "https://www.airbnb.com/s/Tandil--Argentina/homes"
      },
      "Misiones": {
        geo: "Litoral · Selva y agua",
        desc: "En el corazón de la selva, entre agua y vegetación intensa, un refugio que respira verde. Cantos de aves, luz filtrada y una hospitalidad que celebra lo salvaje.",
        photos: [IMG("1470071459604-3b5ec3a7fe05", 1600), LIMG("/assets/photos/guest-doorway.jpg", "guestDoorway"), LIMG("/assets/photos/interior-golden.jpg", "interiorGolden")],
        book: "https://www.airbnb.com/s/Misiones--Argentina/homes"
      },
      "Ushuaia": {
        geo: "Tierra del Fuego · El fin del mundo",
        desc: "En el fin del mundo, entre montañas nevadas y el canal Beagle, una tiny house para los viajeros del último confín. Naturaleza extrema, abrigo absoluto y una vista que no se olvida.",
        photos: [IMG("1469474968028-56623f02e42e", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/interior-golden.jpg", "interiorGolden")],
        book: "https://www.airbnb.com/s/Ushuaia--Argentina/homes"
      }
    }
  },

  // 6 — HOW WE CREATE NEW DESTINATIONS (the model)
  model: {
    eyebrow: "El modelo",
    h2: "Cómo nace un destino NÓMADE.",
    lead: "La fórmula es simple. Un lugar con potencial, nuestra marca de hospitalidad y un estándar compartido. El resultado es un nuevo destino dentro de la red.",
    parts: [
      { icon: "mountain", h: "Propietarios", p: "Aportan un lugar con potencial experiencial." },
      { icon: "compass", h: "NÓMADE", p: "Aporta la visión, el diseño y la operación de hospitalidad." },
      { icon: "badge-check", h: "Estándares", p: "Diseño y hospitalidad consistentes en toda la red." }
    ],
    result: { h: "Un nuevo destino", p: "Una experiencia memorable, sumada a la red NÓMADE." }
  },

  // 7 — DO YOU OWN A LOCATION WITH POTENTIAL? (landowner opportunity)
  landowners: {
    eyebrow: "Para propietarios",
    h2: "¿Tenés un lugar con potencial?",
    lead: "Si tu terreno tiene algo que lo hace especial, podría convertirse en un destino NÓMADE. Vos aportás el lugar; nosotros, la visión, el diseño, la operación y la red — sin que tengas que construir ni administrar nada.",
    img: LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"),
    qualifies: {
      h: "Qué buscamos",
      items: [
        "Un entorno con carácter: montaña, bosque, lago, viñedo, sierra, costa o campo.",
        "Un acceso razonable durante buena parte del año.",
        "Vistas, agua, vegetación o atractivos que hagan único al lugar.",
        "Voluntad de construir algo de largo plazo, en alianza."
      ]
    },
    disqualifies: {
      h: "Qué no es para nosotros",
      items: [
        "Loteos urbanos o terrenos puramente residenciales.",
        "Lugares sin ningún atractivo natural, cultural o paisajístico.",
        "Proyectos que buscan una venta rápida de tierra.",
        "Operaciones de gran escala tipo resort masivo."
      ]
    },
    benefits: [
      { icon: "trending-up", h: "Valor que perdura", p: "Un destino bien hecho crea valor que crece con los años." },
      { icon: "badge-check", h: "Sin gestión de tu parte", p: "NÓMADE diseña, desarrolla y opera. Vos no administrás nada." },
      { icon: "heart-handshake", h: "Una alianza, no una venta", p: "Seguís siendo dueño. Crecemos juntos, con un modelo claro y de largo plazo." }
    ],
    cta: "Postular mi terreno"
  },

  // 8 — SELECTION PROCESS (trust timeline)
  process: {
    eyebrow: "El proceso de selección",
    h2: "De la postulación a la red.",
    lead: "Un camino claro y sin apuro. Cada lugar se evalúa de forma individual; no todos avanzan, y está bien.",
    steps: [
      { n: "01", icon: "send", h: "Postulación", p: "Compartís tu terreno y lo que lo hace único a través del formulario." },
      { n: "02", icon: "search", h: "Evaluación", p: "Analizamos el paisaje, el acceso y la vocación del lugar." },
      { n: "03", icon: "clipboard-check", h: "Factibilidad", p: "Estudiamos viabilidad técnica, legal y de hospitalidad." },
      { n: "04", icon: "drafting-compass", h: "Desarrollo", p: "Diseñamos la propuesta y damos forma a la experiencia." },
      { n: "05", icon: "waypoints", h: "Integración a la red", p: "El destino abre y se suma a la red NÓMADE." }
    ]
  },

  // 9 — INITIAL NÓMADE EVALUATION (the application form)
  form: {
    eyebrow: "Evaluación inicial NÓMADE",
    h2: "Postulá tu terreno.",
    lead: "Esto no es un formulario de contacto: es el primer paso de un proceso de evaluación. Cuanto más completo, mejor podremos leer el potencial de tu lugar.",
    disclaimer: "La postulación no implica exclusividad, transferencia de propiedad, compromiso legal ni obligación de sociedad futura. Todas las evaluaciones son preliminares y exploratorias.",
    sections: [
      "Información del propietario",
      "Ubicación",
      "Características del terreno",
      "Entorno y accesibilidad",
      "Infraestructura",
      "Situación legal y regulatoria",
      "Potencial turístico",
      "Modelo de participación",
      "Fotos y documentación"
    ],
    provincias: [
      "Buenos Aires", "Ciudad de Buenos Aires", "Catamarca", "Chaco", "Chubut",
      "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
      "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta",
      "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
      "Tierra del Fuego", "Tucumán"
    ],
    relaciones: ["Propietario", "Copropietario", "Representante / apoderado", "En sociedad"],
    sizes: [
      "Menos de 1 ha", "1 – 5 ha", "5 – 20 ha", "20 – 100 ha", "Más de 100 ha"
    ],
    topografias: ["Llano", "Ondulado", "Montañoso", "Mixto"],
    paisajes: ["Montaña", "Bosque", "Lago", "Río o arroyo", "Sierra", "Viñedo", "Costa", "Campo", "Desierto"],
    aguas: ["Lago", "Río o arroyo", "Mar o costa", "Vertiente", "Ninguno"],
    accesos: ["Asfalto", "Ripio", "Tierra", "Mixto"],
    estacionalidad: ["Todo el año", "Sólo temporada alta", "Depende del clima"],
    servicios: ["Electricidad", "Agua", "Gas", "Internet / señal", "Cloacas", "Caminos internos"],
    construcciones: ["Sí, habitables", "Sí, a refaccionar", "No"],
    titulo: ["Título perfecto", "En trámite", "Posesión", "Otro"],
    usoSuelo: ["Habilitado para turismo", "A consultar", "No habilitado", "No lo sé"],
    actividades: ["Senderismo", "Pesca", "Cabalgatas", "Náutica", "Vino y gastronomía", "Cultura local", "Avistaje", "Ciclismo"],
    demanda: ["Alta", "Media", "Baja / emergente"],
    modelos: ["Aporte de tierra en sociedad", "Arrendamiento de largo plazo", "Venta", "Abierto a evaluar"],
    inversion: ["Sí", "Parcial", "No", "A evaluar"],
    horizontes: ["Cuanto antes", "Dentro de 1 año", "1 – 3 años", "Sin definir"]
  },

  // 10 — NÓMADE PARTNERS (operators)
  partners: {
    eyebrow: "NÓMADE Partners",
    h2: "¿Ya operás un establecimiento turístico?",
    lead: "Si ya tenés un proyecto en marcha, podés sumarte a la red sin empezar de cero. Llevamos nuestra marca, nuestros estándares y nuestra red de huéspedes a establecimientos que comparten nuestra visión de hospitalidad.",
    audiences: [
      { icon: "tent", h: "Campings y glampings" },
      { icon: "compass", h: "Operadores turísticos" },
      { icon: "grape", h: "Viñedos y bodegas" },
      { icon: "trees", h: "Hospitalidad rural" },
      { icon: "mountain", h: "Propiedades recreativas" },
      { icon: "fuel", h: "Estaciones de servicio" }
    ],
    value: [
      { h: "Una marca que viaja", p: "Sumás el respaldo y la consistencia de NÓMADE a lo que ya construiste." },
      { h: "Acceso a la red", p: "Llegás a una comunidad de huéspedes que busca experiencias como la tuya." },
      { h: "Estándares compartidos", p: "Diseño, servicio y hospitalidad alineados, sin perder tu identidad." }
    ],
    cta: "Quiero ser Partner"
  },

  // 11 — FUTURE GUESTS (waitlist)
  guests: {
    eyebrow: "Para futuros huéspedes",
    h2: "Estamos construyendo los próximos destinos NÓMADE.",
    lead: "Sé una de las primeras personas en enterarte cuando abramos nuevas ubicaciones.",
    placeholder: "Tu email",
    cta: "Avisarme",
    success: "Listo. Te avisaremos cuando abramos los primeros destinos.",
    note: "Sin spam. Sólo novedades sobre nuevas aperturas."
  }
};
