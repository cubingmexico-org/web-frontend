interface Country {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

interface Avatar {
  url: string;
  pending_url: string;
  thumb_url: string;
  is_default: boolean;
}

export interface Delegate {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  wca_id: string;
  gender: string;
  country_iso2: string;
  url: string;
  country: Country;
  delegate_status: string;
  email: string;
  location: string;
  region_id: number;
  class: string;
  teams: unknown[];
  avatar: Avatar;
}

export interface Organizer {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  wca_id: string;
  gender: string;
  country_iso2: string;
  url: string;
  country: Country;
  delegate_status: string | null;
  class: string;
  teams: unknown[];
  avatar: Avatar;
}

export interface Competition {
  id: string;
  name: string;
  venue: string;
  registration_open: string;
  registration_close: string;
  results_posted_at: string | null;
  announced_at: string;
  start_date: string;
  end_date: string;
  competitor_limit: number;
  cancelled_at: string | null;
  url: string;
  website: string;
  short_name: string;
  short_display_name: string;
  city: string;
  venue_address: string;
  venue_details: string;
  latitude_degrees: number;
  longitude_degrees: number;
  country_iso2: string;
  event_ids: string[];
  time_until_registration: string;
  date_range: string;
  delegates: Delegate[];
  organizers: Organizer[];
  class: string;
}