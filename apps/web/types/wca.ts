export interface WcaPersonResponse {
  person: Person;
  competition_count: number;
  personal_records: Record<string, EventRecord>;
  medals: Medals;
  records: Records;
}

/* ---------- PERSON ---------- */

export interface Person {
  name: string;
  gender: string;
  url: string;
  country: Country;
  delegate_status: string | null;
  class: string;
  teams: unknown[]; // If you know the structure, replace any[]
  avatar: Avatar;
  wca_id: string;
  country_iso2: string;
  id: string;
  dob: string; // ISO date string
}

export interface Country {
  id: string;
  name: string;
  continent_id: string;
  iso2: string;
}

export interface Avatar {
  id: number;
  status: string;
  thumbnail_crop_x: number | null;
  thumbnail_crop_y: number | null;
  thumbnail_crop_w: number | null;
  thumbnail_crop_h: number | null;
  url: string;
  thumb_url: string;
  is_default: boolean;
  can_edit_thumbnail: boolean;
}

/* ---------- PERSONAL RECORDS ---------- */

export interface EventRecord {
  single: RecordResult;
  average?: RecordResult; // some events don't have average
}

export interface RecordResult {
  id: number;
  person_id: string;
  event_id: string;
  best: number;
  world_rank: number;
  continent_rank: number;
  country_rank: number;
}

/* ---------- MEDALS / RECORDS ---------- */

export interface Medals {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface Records {
  national: number;
  continental: number;
  world: number;
  total: number;
}
