/* NÓMADE — public landing page content.
   NÓMADE is a HOSPITALITY BRAND. The product is the experience.
   Land is the mechanism used to expand the network; tiny houses / modular
   units are implementation details, never the value proposition. */
const IMG = (id, w) => (typeof window !== 'undefined' && window.__resources && window.__resources[id])
  || `https://images.unsplash.com/photo-${id}?w=${w || 1600}&q=80&auto=format&fit=crop`;
const LIMG = (path, id) => (typeof window !== 'undefined' && window.__resources && window.__resources[id]) || path;

export const NOMADE_ES = {
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
    mapEyebrow: "Regiones en exploración",
    mapH: "Dónde estamos mirando.",
    mapLead: "Empezamos por unas pocas regiones. La red crecerá despacio, en un número acotado de destinos.",
    disclaimer: "Regiones de interés para futuras aperturas. En exploración.",
    terrain: IMG("1426604966848-d7adac402bff", 1400),
    regions: {
      "Bariloche": {
        geo: "Río Negro · Lagos y bosque andino",
        desc: "A orillas de un lago glaciar y rodeada de bosque andino, una casa de diseño donde el silencio y la montaña son los protagonistas. Madera cálida, grandes ventanales y la Patagonia a un paso de la puerta.",
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
      }
    }
  },
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

export const NOMADE_EN = {
  nav: {
    links: [
      ["What is NÓMADE", "que-es"],
      ["Experience", "experiencia"],
      ["Destinations", "destinos"],
      ["Partners", "socios"],
      ["Contact", "contacto"]
    ],
    cta: "Submit location"
  },
  hero: {
    img: IMG("1469474968028-56623f02e42e", 2200),
    eyebrow: "A hospitality network",
    h1a: "Extraordinary experiences.",
    h1b: "Consistent standards.",
    sub1: "Each destination is unique.",
    sub2: "The NÓMADE experience is not.",
    lead: "We are building a network of lodging and wellness experiences in carefully selected locations.",
    cta: "Discover NÓMADE"
  },
  split: {
    eyebrow: "Three ways to join",
    h2: "How do you want to explore NÓMADE?",
    lead: "You already know what it is and what experience it creates. Choose the path that represents you.",
    left: {
      kicker: "Potential",
      img: IMG("1426604966848-d7adac402bff", 1400),
      h: "I have a location with potential",
      p: "You own a place with character and want to convert it into a destination, in partnership with NÓMADE — without building or managing anything.",
      cta: "I want to be part",
      target: "propietarios"
    },
    middle: {
      kicker: "PARTNER",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1100&q=80&auto=format&fit=crop",
      h: "I already operate an establishment",
      p: "You have a camping, glamping, vineyard, or lodging underway and want to add the NÓMADE brand, standards, and guest network.",
      cta: "I want to be Partner",
      target: "socios"
    },
    right: {
      kicker: "Experience",
      img: LIMG("/assets/photos/guest-doorway.jpg", "guestDoorway"),
      h: "I want to discover NÓMADE",
      p: "You dream of escaping to a cared-for destination, in the middle of nature. Get to know the experience and find out first when we open new locations.",
      cta: "Discover the experience",
      target: "destinos"
    }
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
    img: LIMG("/assets/photos/interior-golden.jpg", "interiorGolden"),
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
  destinations: {
    eyebrow: "Destinations worth discovering",
    h2: "We look for potential, not postcards.",
    lead: "A NÓMADE destination can be born in many landscapes. What they have in Holiday is not the type of terrain, but its potential to become an unforgettable experience.",
    types: [
      { img: IMG("1469474968028-56623f02e42e", 1200), cap: "Mountains" },
      { img: IMG("1500382017468-9049fed747ef", 1200), cap: "Vineyards" },
      { img: IMG("1470071459604-3b5ec3a7fe05", 1200), cap: "Forests" },
      { img: IMG("1501785888041-af3ef285b470", 1200), cap: "Lakes" },
      { img: IMG("1426604966848-d7adac402bff", 1200), cap: "Countryside & ranches" },
      { img: IMG("1454496522488-7a8e488e8606", 1200), cap: "Rural and cultural settings" }
    ],
    note: "Conceptual images that illustrate the type of potential we look for. NÓMADE does not yet have operating destinations.",
    mapEyebrow: "Regions in exploration",
    mapH: "Where we are looking.",
    mapLead: "We start with a few regions. The network will grow slowly, in a limited number of destinations.",
    disclaimer: "Regions of interest for future openings. Under exploration.",
    terrain: IMG("1426604966848-d7adac402bff", 1400),
    regions: {
      "Bariloche": {
        geo: "Río Negro · Lakes and Andean forest",
        desc: "On the shores of a glacial lake and surrounded by Andean forest, a designer tiny house where silence and the mountain are the protagonists. Warm wood, large windows, and Patagonia a step from the door.",
        photos: [IMG("1501785888041-af3ef285b470", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/interior-golden.jpg", "interiorGolden")],
        book: "https://www.airbnb.com/s/Bariloche--Argentina/homes"
      },
      "El Bolsón": {
        geo: "Río Negro · Mountain valley",
        desc: "In a valley between rivers and orchards, an intimate refuge to disconnect from the world. Wake up with the scent of forest and the mountain range framing each window.",
        photos: [IMG("1470071459604-3b5ec3a7fe05", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/guest-doorway.jpg", "guestDoorway")],
        book: "https://www.airbnb.com/s/El-Bolson--Argentina/homes"
      },
      "Mendoza": {
        geo: "Cuyo · Vineyards and Andes",
        desc: "Between vineyards and the silhouette of the Andes, a small house designed for slow rest. Wine sunsets, huge skies, and the silent comfort of NÓMADE.",
        photos: [IMG("1500382017468-9049fed747ef", 1600), LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"), LIMG("/assets/photos/interior-golden.jpg", "interiorGolden")],
        book: "https://www.airbnb.com/s/Mendoza--Argentina/homes"
      }
    }
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
    img: LIMG("/assets/photos/cabins-exterior.jpg", "cabinsExterior"),
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
  form: {
    eyebrow: "Initial NÓMADE Evaluation",
    h2: "Submit your land.",
    lead: "This is not a contact form: it is the first step of an evaluation process. The more complete, the better we can assess your land's potential.",
    disclaimer: "Submitting your land does not imply exclusivity, transfer of ownership, legal commitment, or future partnership obligations. All evaluations are preliminary and exploratory.",
    sections: [
      "Owner information",
      "Location",
      "Land characteristics",
      "Surrounding & accessibility",
      "Infrastructure",
      "Legal & regulatory situation",
      "Tourism potential",
      "Participation model",
      "Photos & documentation"
    ],
    provincias: [
      "Buenos Aires", "Ciudad de Buenos Aires", "Catamarca", "Chaco", "Chubut",
      "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
      "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta",
      "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
      "Tierra del Fuego", "Tucumán"
    ],
    relaciones: ["Owner", "Co-owner", "Representative / proxy", "In partnership"],
    sizes: [
      "Less than 1 ha", "1 – 5 ha", "5 – 20 ha", "20 – 100 ha", "More than 100 ha"
    ],
    topografias: ["Flat", "Hilly", "Mountainous", "Mixed"],
    paisajes: ["Mountain", "Forest", "Lake", "River or stream", "Hills", "Vineyard", "Coast", "Field", "Desert"],
    aguas: ["Lake", "River or stream", "Sea or coast", "Spring water", "None"],
    accesos: ["Asphalt", "Gravel", "Dirt road", "Mixed"],
    estacionalidad: ["All year round", "Only peak season", "Weather dependent"],
    servicios: ["Electricity", "Water", "Gas", "Internet / signal", "Sewers", "Internal roads"],
    construcciones: ["Yes, habitable", "Yes, to renovate", "No"],
    titulo: ["Perfect title deed", "In process", "Possession", "Other"],
    usoSuelo: ["Approved for tourism", "To be checked", "Not approved", "Don't know"],
    actividades: ["Hiking", "Fishing", "Horseback riding", "Water sports", "Wine & gastronomy", "Local culture", "Wildlife watching", "Cycling"],
    demanda: ["High", "Medium", "Low / emerging"],
    modelos: ["Land contribution in partnership", "Long-term lease", "Sale", "Open to evaluation"],
    inversion: ["Yes", "Partial", "No", "To be evaluated"],
    horizontes: ["As soon as possible", "Within 1 year", "1 – 3 years", "Undefined"]
  },
  partners: {
    eyebrow: "NÓMADE Partners",
    h2: "Do you already operate a tourism establishment?",
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
  }
};

export const NOMADE = {
  es: NOMADE_ES,
  en: NOMADE_EN
};
