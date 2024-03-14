export interface Activity {
    _id: any;
    name: string;
    description: string;
    groups: [];
    members: [];
    roles: [],
    privacy: string;
}

export interface Member {
  name: string | String;
  _id: string;
  email: string | String;
  role: string;
  username: string | String;
}

export interface Organization {
  _id: any;
  name: string;
  description: string;
  email: string;
  contact: string;
  domain: string;
  privacy: string;
  members: Member[];
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

export interface Calendar {
  _id: any;
  userID: any;
  privacy: string;
  events?: Evento[];
  reminders?: Recordatorio[];
}

export interface Time {
  startTime: Date;
  endTime: Date;
}

export interface Schedule {
  days: any[]; // Aquí deberías definir el tipo correcto para los días (por ejemplo: string[])
  times: Time[];
}


export interface Group {
  _id: any;
  name: string;
  description: string;
  members?: any[];
  events?: any[];
  roles?: any[];
  privacy: string;
  schedules?: any[];
}
