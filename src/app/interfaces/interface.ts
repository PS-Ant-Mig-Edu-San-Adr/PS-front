export interface Activity {
    id: number;
    name: string;
}

export interface Organization {
  id: number;
  name: string;
  activities?: Activity[];
}

export interface Recordatorio {
  id: number;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion?: string;
  tipo?: string;
  color?: string;
  repetir?: string;
}

export interface Evento {
  id: number;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion?: string;
  ubicacion?: string;
  tipo?: string;
  color?: string;
  repetir?: string;
  notas?: string;
  estado?: string;
  adjuntos?: string;
  grupo?: number;
}