export interface Activity {
    id: number;
    name: string;
  }

  export interface Organization {
    id: number;
    name: string;
    activities?: Activity[];
  }