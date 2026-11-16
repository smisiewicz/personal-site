export interface ExperienceEntry {
  date: string;
  title: string;
  company: string;
  description?: string;
  highlights?: string[];
}

export interface ProjectEntry {
  company: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  images?: string[];
}

export interface SocialLink {
  label: string;
  url: string;
  icon: 'github' | 'linkedin';
}

export type SectionId = 'about' | 'experience' | 'projects' | 'contact';

/** Sections that open into a sub-hive of item cells rather than straight into a panel. */
export type HubSectionId = 'experience' | 'projects';

/** Where the camera is: the overview (no section), a section, or one item inside a hub section. */
export interface Focus {
  section: SectionId | null;
  item: number | null;
}
