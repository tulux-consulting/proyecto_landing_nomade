/* ============================================================
   NÓMADE — Backoffice data store.
   ------------------------------------------------------------
   Sitio estático sin servidor: los datos viven en localStorage,
   namespaced bajo "nomade_bo_". Esto simula la capa de datos del
   backend. Cada colección es una lista de registros; el contenido
   del sitio y los ajustes son objetos únicos.

   👉 Para conectar con un backend real, reemplazá read()/write()
   por llamadas a tu API manteniendo la misma firma.
   ============================================================ */
const BO = (function () {
  var PREFIX = "nomade_bo_";
  var SEED_FLAG = PREFIX + "seeded_v2";
  var subs = new Set();
  var USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase';


  function emit() { subs.forEach(function (fn) { try { fn(); } catch (e) { } }); }
  function read(key, fallback) {
    try {
      if (typeof window === 'undefined') return fallback;
      var r = localStorage.getItem(PREFIX + key); return r ? JSON.parse(r) : fallback;
    }
    catch (e) { return fallback; }
  }
  function write(key, val) {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PREFIX + key, JSON.stringify(val));
    } catch (e) { }
    emit();
  }
  function uid(p) { return (p || "id") + "_" + Math.random().toString(36).slice(2, 9); }
  function nowISO(daysAgo) {
    var d = new Date();
    if (daysAgo) d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  }

  // ---- Collections API -------------------------------------------------
  function all(col) { return read(col, []); }
  function get(col, id) { return all(col).find(function (r) { return r.id === id; }) || null; }
  function insert(col, rec) {
    var list = all(col);
    rec.id = rec.id || uid(col);
    rec.fecha = rec.fecha || nowISO(0);
    list.unshift(rec);
    write(col, list);
    return rec;
  }
  function update(col, id, patch) {
    var list = all(col).map(function (r) { return r.id === id ? Object.assign({}, r, patch) : r; });
    write(col, list);
    return get(col, id);
  }
  function remove(col, id) {
    write(col, all(col).filter(function (r) { return r.id !== id; }));
  }
  function addNote(col, id, texto, autor) {
    var rec = get(col, id); if (!rec) return;
    var notas = (rec.notas || []).concat([{ id: uid("n"), texto: texto, autor: autor || "admin", fecha: nowISO(0) }]);
    return update(col, id, { notas: notas });
  }

  // ---- Singletons (CMS content, settings) ------------------------------
  function getDoc(key, fallback) { return read(key, fallback); }
  function setDoc(key, val) { write(key, val); }

  // ---- Seed ------------------------------------------------------------
  var PROVS = ["Buenos Aires", "Río Negro", "Mendoza", "Córdoba", "Neuquén", "Salta", "Chubut", "Tierra del Fuego", "Misiones", "San Juan", "Santa Fe", "Tucumán"];

  function seed() {
    if (typeof window === 'undefined') return;
    try {
      if (USE_SUPABASE) {
        localStorage.setItem(PREFIX + "postulaciones", JSON.stringify([]));
      }
      if (localStorage.getItem(SEED_FLAG)) {
        if (USE_SUPABASE) {
          localStorage.setItem(PREFIX + "postulaciones", JSON.stringify([]));
        }
        return;
      }


      // — POSTULACIONES (terrenos) —
      var ESTADOS = ["Nuevo", "Pendiente de revisión", "Contactado", "En negociación", "Aprobado", "Rechazado"];
      var FOTOS_POOL = ["1501785888041-af3ef285b470", "1470071459604-3b5ec3a7fe05", "1500382017468-9049fed747ef", "1426604966848-d7adac402bff", "1454496522488-7a8e488e8606", "1469474968028-56623f02e42e", "1472396961693-142e6e269027", "1433086966358-54859d0ed716", "1518495973542-4542c06a5843", "1441974231531-c6227db76b6e"];
      var RELACIONES = ["Propietario", "Copropietario", "Representante / Apoderado", "Sociedad"];
      var TOPOS = ["Llano", "Ondulado", "Montañoso", "Mixto", "Con pendiente pronunciada"];
      var ACCESO_TIPO = ["Ruta asfaltada", "Camino de ripio", "Camino de tierra", "Huella / sendero"];
      var ACCESO_DISP = ["Todo el año", "Estacional (verano)", "Limitado en invierno por nieve"];
      var USO_SUELO = ["Rural", "Rural turístico", "Mixto", "Sin restricción de uso"];
      var SERVICIOS_POOL = ["Electricidad de red", "Agua de vertiente", "Pozo de agua", "Internet satelital", "Señal de celular", "Sin servicios cercanos", "Energía solar instalada"];
      var DEMANDAS = ["Alta — destino turístico consolidado", "Media — en crecimiento", "Incipiente — sin desarrollar"];
      var INVERSIONES = ["No, solo aporto la tierra", "Hasta USD 50.000", "USD 50.000 – 150.000", "Más de USD 150.000", "A definir según el proyecto"];
      var HORIZONTES = ["Corto plazo (este año)", "Mediano plazo (1–2 años)", "Largo plazo (sin apuro)"];
      function pick(arr, i) { return arr[i % arr.length]; }
      function richPost(r, i) {
        var fa = (FOTOS_POOL[i % FOTOS_POOL.length]);
        var fb = (FOTOS_POOL[(i + 3) % FOTOS_POOL.length]);
        var fc = (FOTOS_POOL[(i + 6) % FOTOS_POOL.length]);
        var nFotos = (i % 4 === 0) ? 4 : (i % 3 === 0 ? 2 : 3);
        var fotos = [fa, fb, fc, FOTOS_POOL[(i + 1) % FOTOS_POOL.length]].slice(0, nFotos);
        return {
          relacion: pick(RELACIONES, i),
          mapsLink: (i % 3 === 0) ? "" : "https://maps.google.com/?q=" + (-34 - (i % 12)) + "." + (100 + i) + ",-" + (62 + (i % 8)) + "." + (200 + i),
          distanciaCiudad: (8 + (i * 7) % 95) + " km a " + r[3],
          topografia: pick(TOPOS, i), cuerpoAgua: (r[5] || [])[0] || "Sin cuerpo de agua",
          vistas: ["Montaña y valle", "Lago y bosque", "Sierras al atardecer", "Viñedos y cordillera", "Selva y saltos de agua", "Estepa y cielo abierto"][i % 6],
          vegetacion: ["Bosque nativo de coihues y arrayanes", "Arboleda madura y pastizal", "Monte bajo y especies autóctonas", "Viñedo y olivos", "Selva paranaense densa", "Vegetación de altura, baja y resistente"][i % 6],
          accesoTipo: pick(ACCESO_TIPO, i), accesoDisp: pick(ACCESO_DISP, i),
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
          participacion: { modelo: r[6], inversion: pick(INVERSIONES, i), horizonte: pick(HORIZONTES, i) },
          fotos: fotos,
          documentos: (i % 3 === 0) ? [] : [{ nombre: "Plano catastral.pdf", tipo: "PDF" }, { nombre: "Título de propiedad.pdf", tipo: "PDF" }].slice(0, (i % 2) + 1)
        };
      }
      var post = [
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
      ].map(function (r, i) {
        return Object.assign({
          id: uid("post"), fecha: nowISO(r[8]),
          nombre: r[0], apellido: r[1], email: (r[0] + "." + r[1]).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "@gmail.com",
          telefono: "+54 9 " + (290 + Math.floor(Math.random() * 80)) + " " + (400 + Math.floor(Math.random() * 599)) + "-" + (1000 + Math.floor(Math.random() * 8999)),
          provincia: r[2], localidad: r[3], tamano: r[4], paisaje: r[5], modelo: r[6],
          estado: r[7], archivado: false, comentarios: r[9], notas: []
        }, richPost(r, i));
      });
      if (!USE_SUPABASE) {
        write("postulaciones", post);
      } else {
        write("postulaciones", []);
      }

      // — PARTNERS (establecimientos) —
      var TIPOS = ["Camping", "Glamping", "Operador turístico", "Viñedo / Bodega", "Hospitalidad rural", "Propiedad recreativa", "Otro"];
      var part = [
        ["Refugio del Lago", "Glamping", "Río Negro", "Bariloche", "Aprobado", 14, "8 domos sobre el lago, en operación hace 3 años. Marca consolidada localmente."],
        ["Bodega Tierra Alta", "Viñedo / Bodega", "Mendoza", "Luján de Cuyo", "En negociación", 6, "Bodega boutique con restaurante; busca sumar hospedaje de la mano de NÓMADE."],
        ["Camping Los Alerces", "Camping", "Chubut", "Esquel", "Contactado", 9, "Camping tradicional dentro del corredor de los Alerces, quiere elevar su propuesta."],
        ["Estancia La Federada", "Hospitalidad rural", "Buenos Aires", "San Antonio de Areco", "Nuevo", 0, "Casco histórico, cabalgatas y gastronomía de campo."],
        ["Andes Expediciones", "Operador turístico", "Mendoza", "Uspallata", "Pendiente de revisión", 2, "Operador de trekking y montañismo, quiere integrar alojamiento NÓMADE."],
        ["Posada del Viñedo", "Viñedo / Bodega", "Salta", "Cafayate", "Nuevo", 1, "Pequeña posada entre viñedos de altura."],
        ["Glamping Selva Viva", "Glamping", "Misiones", "Puerto Iguazú", "Contactado", 7, "Carpas de lujo cerca de las cataratas, alta ocupación todo el año."],
        ["Casa de Campo El Ombú", "Propiedad recreativa", "Córdoba", "Mina Clavero", "Rechazado", 25, "Propiedad sin diferencial experiencial; no alinea con la red."],
        ["Patagonia Wild Lodge", "Hospitalidad rural", "Santa Cruz", "El Chaltén", "En negociación", 4, "Lodge de montaña con vista al Fitz Roy, marca con buena reputación."]
      ].map(function (r, i) {
        return {
          id: uid("part"), fecha: nowISO(r[5]),
          nombre: r[0], tipo: r[1], fiscal: "30-" + (60000000 + Math.floor(Math.random() * 9000000)) + "-" + Math.floor(Math.random() * 9),
          provincia: r[2], localidad: r[3],
          telefono: "+54 9 " + (290 + Math.floor(Math.random() * 80)) + " " + (400 + Math.floor(Math.random() * 599)) + "-" + (1000 + Math.floor(Math.random() * 8999)),
          email: "contacto@" + r[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") + ".com",
          web: (i % 3 === 0) ? "" : "https://" + r[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "") + ".com",
          capacidad: (4 + (i * 3) % 30) + " plazas", anosOperando: (i % 6),
          estado: r[4], archivado: false, descripcion: r[6],
          fotos: [FOTOS_POOL[i % FOTOS_POOL.length], FOTOS_POOL[(i + 4) % FOTOS_POOL.length], FOTOS_POOL[(i + 7) % FOTOS_POOL.length]].slice(0, (i % 3 === 0 ? 1 : 3)),
          notas: []
        };
      });
      write("partners", part);

      // — HUÉSPEDES (lista de espera + analítica de origen) —
      var GEO = [
        ["Argentina", "Buenos Aires", "CABA"], ["Argentina", "Buenos Aires", "La Plata"], ["Argentina", "Córdoba", "Córdoba"],
        ["Argentina", "Mendoza", "Mendoza"], ["Argentina", "Santa Fe", "Rosario"], ["Argentina", "Río Negro", "Bariloche"],
        ["Argentina", "Neuquén", "Neuquén"], ["Argentina", "Buenos Aires", "Mar del Plata"], ["Argentina", "Tucumán", "San Miguel"],
        ["Chile", "Región Metropolitana", "Santiago"], ["Uruguay", "Montevideo", "Montevideo"], ["España", "Madrid", "Madrid"],
        ["Estados Unidos", "California", "San Francisco"], ["Brasil", "São Paulo", "São Paulo"]
      ];
      var NAVS = ["Chrome", "Safari", "Firefox", "Edge"];
      var SOS = ["iOS", "Android", "macOS", "Windows"];
      var DEVS = ["Móvil", "Escritorio", "Tablet"];
      var WEIGHTS = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 0, 0, 1, 1, 2, 5, 6, 0, 3, 0, 1, 1, 8, 9, 0, 2, 12]; // skew toward AR / BA
      var hue = WEIGHTS.map(function (g, i) {
        var loc = GEO[g % GEO.length];
        var dev = DEVS[Math.floor(Math.random() * (i % 3 === 0 ? 1 : 3))];
        var so = dev === "Móvil" ? (Math.random() > 0.5 ? "iOS" : "Android") : (Math.random() > 0.5 ? "macOS" : "Windows");
        return {
          id: uid("hue"), fecha: nowISO(Math.floor(Math.random() * 40)),
          email: ["lucia", "mateo", "sofia", "joaquin", "valen", "nico", "flor", "tomas", "agus", "renata", "bruno", "delfi", "santi", "mora"][i % 14] + (10 + i) + "@gmail.com",
          pais: loc[0], provincia: loc[1], ciudad: loc[2],
          navegador: NAVS[Math.floor(Math.random() * NAVS.length)], so: so, dispositivo: dev
        };
      });
      write("huespedes", hue);

      // — DESTINOS (ABM) —
      var COMPLEJOS = ["Complejo Arcoíris", "Refugio del Lago", "Domos del Valle", "Casa de Piedra", "Mirador de las Sierras", "Selva Adentro", "Cabañas del Fin del Mundo"];
      var dest = [
        ["Bariloche", "Río Negro · Lagos y bosque andino", "Disponible", "A orillas de un lago glaciar y rodeada de bosque andino, una casa de diseño donde el silencio y la montaña son los protagonistas.", "1501785888041-af3ef285b470"],
        ["Mendoza", "Cuyo · Viñedos y cordillera", "Disponible", "Entre viñedos y la silueta de los Andes, una casa pequeña pensada para el descanso lento.", "1500382017468-9049fed747ef"],
        ["El Bolsón", "Río Negro · Valle de montaña", "No disponible", "En un valle entre ríos y huertas, un refugio íntimo para desconectar del mundo.", "1470071459604-3b5ec3a7fe05"],
        ["Villa General Belgrano", "Córdoba · Sierras y arroyos", "No disponible", "En las sierras de Córdoba, junto a un arroyo de agua clara, un espacio sereno entre árboles.", "1426604966848-d7adac402bff"],
        ["Tandil", "Buenos Aires · Sierras y campo", "No disponible", "Sobre las sierras bonaerenses, entre campo abierto y piedra, un retiro luminoso lejos del ruido.", "1454496522488-7a8e488e8606"],
        ["Misiones", "Litoral · Selva y agua", "No disponible", "En el corazón de la selva, entre agua y vegetación intensa, un refugio que respira verde.", "1470071459604-3b5ec3a7fe05"],
        ["Ushuaia", "Tierra del Fuego · El fin del mundo", "No disponible", "En el fin del mundo, entre montañas nevadas y el canal Beagle, una casa para los viajeros del último confín.", "1469474968028-56623f02e42e"]
      ].map(function (r, i) {
        return {
          id: uid("dest"), fecha: nowISO(30 - i),
          nombre: r[0], complejo: COMPLEJOS[i % COMPLEJOS.length], ubicacion: r[1], estado: r[2], descripcion: r[3], imagen: r[4],
          fotos: [r[4], FOTOS_POOL[(i + 2) % FOTOS_POOL.length], FOTOS_POOL[(i + 5) % FOTOS_POOL.length]],
          reserva: r[2] === "Disponible" ? "https://www.airbnb.com/s/" + r[0].replace(/ /g, "-") + "--Argentina/homes" : "",
          archivado: false
        };
      });
      write("destinos", dest);

      // — ROLES (ABM) + USUARIOS con rol asignado —
      var ALLMODS = ["dashboard", "postulaciones", "partners", "huespedes", "destinos", "contenido", "ajustes"];
      var rolesSeed = [
        ["Administrador", "Acceso total al panel y a la gestión de usuarios y roles.", ALLMODS.slice(), true],
        ["Operaciones", "Gestiona postulaciones, partners, destinos y la lista de huéspedes.", ["dashboard", "postulaciones", "partners", "destinos", "huespedes"], false],
        ["Marketing", "Lista de huéspedes y contenido del sitio.", ["dashboard", "huespedes", "contenido"], false],
        ["Contenido", "Edita el contenido y las imágenes de la landing.", ["dashboard", "contenido"], false],
        ["Ventas", "Seguimiento de postulaciones y partners.", ["dashboard", "postulaciones", "partners"], false]
      ].map(function (r) {
        return { id: uid("rol"), nombre: r[0], descripcion: r[1], modulos: r[2], sistema: r[3], fecha: nowISO(120) };
      });
      write("roles", rolesSeed);
      function rolId(n) { var x = rolesSeed.find(function (r) { return r.nombre === n; }); return x ? x.id : null; }

      write("usuarios", [
        { id: uid("usr"), nombre: "Administrador", email: "admin@nomade.com", rolId: rolId("Administrador"), activo: true, fecha: nowISO(120) },
        { id: uid("usr"), nombre: "Valeria Cano", email: "valeria@nomade.com", rolId: rolId("Operaciones"), activo: true, fecha: nowISO(60) },
        { id: uid("usr"), nombre: "Martín Reyes", email: "martin@nomade.com", rolId: rolId("Marketing"), activo: true, fecha: nowISO(40) },
        { id: uid("usr"), nombre: "Paula Giménez", email: "paula@nomade.com", rolId: rolId("Ventas"), activo: false, fecha: nowISO(20) }
      ]);

      // — CONTENIDO DEL SITIO (CMS) —
      setDoc("contenido", {
        hero: {
          eyebrow: "Una red de hospitalidad",
          titulo: "Experiencias extraordinarias. Estándares consistentes.",
          subtitulo: "Cada destino es único. La experiencia NÓMADE no.",
          lead: "Estamos construyendo una red de experiencias de alojamiento y bienestar en ubicaciones cuidadosamente seleccionadas.",
          cta: "Descubrir NÓMADE"
        },
        beneficios: {
          eyebrow: "La experiencia NÓMADE",
          titulo: "Pensado para quien lo vive.",
          items: [
            { h: "Diseño", p: "Espacios serenos que elevan el lugar en lugar de competir con él." },
            { h: "Bienestar", p: "Tiempo para desacelerar. Descanso, naturaleza y silencio como punto de partida." },
            { h: "Privacidad", p: "Lugares propios, lejos del ruido. La sensación de tener el paisaje para vos." },
            { h: "Hospitalidad", p: "Atención atenta y discreta, capaz de anticiparse a lo que necesitás." }
          ]
        },
        comoFunciona: {
          eyebrow: "El proceso de selección",
          titulo: "De la postulación a la red.",
          pasos: [
            { h: "Postulación", p: "Compartís tu terreno y lo que lo hace único a través del formulario." },
            { h: "Evaluación", p: "Analizamos el paisaje, el acceso y la vocación del lugar." },
            { h: "Factibilidad", p: "Estudiamos viabilidad técnica, legal y de hospitalidad." },
            { h: "Desarrollo", p: "Diseñamos la propuesta y damos forma a la experiencia." },
            { h: "Integración a la red", p: "El destino abre y se suma a la red NÓMADE." }
          ]
        },
        estadisticas: {
          eyebrow: "La red en formación",
          items: [
            { valor: "7", label: "regiones en exploración" },
            { valor: "4", label: "tipos de paisaje" },
            { valor: "100%", label: "experiencias diseñadas a medida" }
          ]
        },
        faqs: {
          eyebrow: "Preguntas frecuentes",
          titulo: "Lo que solemos responder.",
          items: [
            { q: "¿NÓMADE compra mi terreno?", a: "No necesariamente. Trabajamos con distintos modelos: sociedad, arrendamiento de largo plazo o venta. Vos elegís el que te representa." },
            { q: "¿Tengo que construir o administrar algo?", a: "No. NÓMADE diseña, desarrolla y opera la experiencia. Vos aportás el lugar." },
            { q: "¿Cuánto tarda el proceso de evaluación?", a: "Cada lugar se evalúa de forma individual. La evaluación inicial puede tomar algunas semanas." }
          ]
        },
        contacto: {
          email: "hola@nomade.com",
          telefono: "+54 9 11 5555-0000",
          direccion: "Buenos Aires, Argentina"
        },
        redes: {
          instagram: "https://instagram.com/nomade",
          linkedin: "https://linkedin.com/company/nomade",
          whatsapp: "https://wa.me/5491155550000"
        },
        footer: {
          tagline: "Una red de hospitalidad y bienestar. Experiencias extraordinarias, estándares consistentes, en ubicaciones cuidadosamente seleccionadas.",
          copyright: "© 2026 NÓMADE — Red de hospitalidad y bienestar."
        }
      });

      setDoc("ajustes", {
        panelNombre: "Panel NÓMADE",
        idioma: "Español (Argentina)",
        zonaHoraria: "America/Argentina/Buenos_Aires",
        notificaciones: { nuevaPostulacion: true, nuevoPartner: true, resumenSemanal: false }
      });

      localStorage.setItem(SEED_FLAG, "1");
      emit();
    } catch (e) { }
  }

  // ---- Module metadata (single source of truth) ------------------------
  var MODULES = [
    { key: "dashboard", label: "Panel", route: "/panel", icon: "layout-grid", col: null },
    { key: "postulaciones", label: "Postulaciones", route: "/panel/postulaciones", icon: "clipboard-list", col: "postulaciones", desc: "Personas que postulan un terreno para convertirse en destino." },
    { key: "partners", label: "Partners", route: "/panel/partners", icon: "handshake", col: "partners", desc: "Establecimientos que quieren sumar experiencias a la red." },
    { key: "huespedes", label: "Lista de huéspedes", route: "/panel/huespedes", icon: "users", col: "huespedes", desc: "Personas interesadas en hospedarse y de dónde proviene el interés." },
    { key: "destinos", label: "Destinos", route: "/panel/destinos", icon: "map-pin", col: "destinos", desc: "Las experiencias de hospedaje de la red NÓMADE." },
    { key: "contenido", label: "Contenido del sitio", route: "/panel/contenido", icon: "layout-template", col: null, desc: "Administrá el contenido de la landing sin tocar código." },
    { key: "ajustes", label: "Ajustes", route: "/panel/ajustes", icon: "settings", col: null, desc: "Usuarios y roles de acceso al panel." }
  ];

  // Active backoffice user (for permission gating; defaults to owner / admin).
  function rolePerms(u) {
    if (!u) return [];
    var rol = u.rolId ? get("roles", u.rolId) : null;
    if (rol) return rol.modulos.slice();
    return u.permisos ? u.permisos.slice() : MODULES.map(function (m) { return m.key; });
  }
  function withPerms(u) {
    if (!u) return u;
    var rol = u.rolId ? get("roles", u.rolId) : null;
    return Object.assign({}, u, { permisos: rolePerms(u), rolNombre: rol ? rol.nombre : (u.rol || "—") });
  }
  function currentUser() {
    var users = all("usuarios");
    var key = read("activeUser", null);
    var u = (key && users.find(function (u) { return u.id === key; })) || users[0] || { nombre: "Administrador", permisos: MODULES.map(function (m) { return m.key; }), rolNombre: "Administrador" };
    return withPerms(u);
  }
  function setActiveUser(id) { write("activeUser", id); }

  var __BO = {
    PREFIX: PREFIX, MODULES: MODULES, PROVS: PROVS, ESTADOS: ESTADOS_LIST(),
    TIPOS_ESTAB: ["Camping", "Glamping", "Operador turístico", "Viñedo / Bodega", "Hospitalidad rural", "Propiedad recreativa", "Otro"],
    all: all, get: get, insert: insert, update: update, remove: remove, addNote: addNote,
    getDoc: getDoc, setDoc: setDoc, uid: uid, rolePerms: rolePerms, withPerms: withPerms,
    currentUser: currentUser, setActiveUser: setActiveUser,
    write: write,
    subscribe: function (fn) { subs.add(fn); return function () { subs.delete(fn); }; },
    seed: seed
  };
  function ESTADOS_LIST() { return ["Nuevo", "Pendiente de revisión", "Contactado", "En negociación", "Aprobado", "Rechazado"]; }

  seed();

  return __BO;
})();

export { BO };
