import { NotaInterna } from '../applications/application.types';

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
  notas: NotaInterna[];
  origen?: string;
}
