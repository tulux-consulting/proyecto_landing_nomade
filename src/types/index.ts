export interface NotaInterna {
  id: string;
  texto: string;
  autor: string;
  fecha: string;
}

export interface DocumentoAdjunto {
  nombre: string;
  tipo: string;
}

export interface Postulacion {
  id: string;
  fecha: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  provincia: string;
  localidad: string;
  tamano: string;
  paisaje: string[];
  modelo: string;
  estado: string;
  archivado: boolean;
  comentarios?: string;
  notas: NotaInterna[];
  relacion?: string;
  mapsLink?: string;
  distanciaCiudad?: string;
  topografia?: string;
  cuerpoAgua?: string;
  vistas?: string;
  vegetacion?: string;
  accesoTipo?: string;
  accesoDisp?: string;
  servicios?: string[];
  construcciones?: string;
  legal?: {
    titulo: string;
    usoSuelo: string;
    restricciones: string;
    observaciones: string;
  };
  turismo?: {
    actividades: string[];
    atractivos: string;
    demanda: string;
  };
  participacion?: {
    modelo: string;
    inversion: string;
    horizonte: string;
  };
  fotos?: string[];
  documentos?: DocumentoAdjunto[];
}

export interface Partner {
  id: string;
  fecha: string;
  nombre: string;
  tipo: string;
  fiscal: string;
  provincia: string;
  localidad: string;
  telefono: string;
  email: string;
  web?: string;
  capacidad?: string;
  anosOperando?: number;
  estado: string;
  archivado: boolean;
  descripcion?: string;
  fotos?: string[];
  notas: NotaInterna[];
  origen?: string;
}

export interface Destino {
  id: string;
  fecha: string;
  nombre: string;
  complejo: string;
  ubicacion: string;
  estado: string;
  descripcion: string;
  imagen: string;
  fotos: string[];
  reserva: string;
  archivado: boolean;
}

export interface Huesped {
  id: string;
  fecha: string;
  email: string;
  pais: string;
  provincia: string;
  ciudad: string;
  navegador: string;
  so: string;
  dispositivo: string;
}
