export interface Activity {
    _id: any;
    name: string;
    description: string;
    groups: [];
    members: [];
    roles: [],
    privacy: string;
}

export interface Organization {
  _id: any;
  name: string;
  description: string;
  email: string;
  contact: string;
  domain: string;
  privacy: string;
  members: [];
  activities?: Activity[];
}

export interface User {
  _id: any,
  fullName: String,
  email: String,
  username: String
  passwordHash: String,
  creationDate: String,
  timeZone: String,
  preferredLanguage: String,
  notificationSettings: String,
  avatar: String,
  calendar: any
  groups: Array<any>,
  tags: Array<String>
}

export interface Recordatorio {
  _id: any;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion?: string;
  tipo?: string;
  color?: string;
  repetir?: string;
}

export interface Evento {
  _id: any;
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