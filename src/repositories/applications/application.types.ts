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
  aeropuerto?: string;
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
