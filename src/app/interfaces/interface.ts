export interface Activity {
    id: any;
    name: string;
}

export interface Organization {
  id: any;
  name: string;
  activities?: Activity[];
}

export interface Recordatorio {
  id: any;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion?: string;
  tipo?: string;
  color?: string;
  repetir?: string;
}

export interface Evento {
  id: any;
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