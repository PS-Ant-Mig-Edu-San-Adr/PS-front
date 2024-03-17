export interface Activity {
    _id: any;
    parentOrganization: any;
    name: string;
    description: string;
    groups: Group[];
    members: Member[];
    privacy: string;
}

export interface Member {
  _id: any;
  name: string | String;
  email: string | String;
  role: string;
  username: string | String;
}

export interface Organization {
  _id: any;
  name: string;
  description: string;
  imageUrl: string;
  email: string;
  contact: string;
  domain: string;
  privacy: string;
  members: Member[];
  activities: Activity[];
}

export interface User {
  _id: any,
  fullName: String,
  email: String,
  username: String
  passwordHash: String,
  creationDate?: String,
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
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  type: string;
  color: string;
  repeat: string;
}

export interface Evento {
  _id: any;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  location?: string;
  type: string;
  color: string;
  repeat: string;
  notes?: string;
  status: string;
  attachments?: string;
  group?: number;
}

export interface Calendar {
  _id: any;
  userID: any;
  privacy: string;
  events: Evento[];
  reminders: Recordatorio[];
}

export interface Schedule {
  startTime: Date;
  endTime: Date;
  day: String;
}


export interface Group {
  parentOrganization: any;
  parentActivity: any;
  _id: any;
  name: string;
  description: string;
  members: Member[];
  events: Evento[];
  privacy: string;
  schedules: Schedule[];
}
