import type { SectionId } from '@/types';

export interface SectionMeta {
  id: SectionId;
  label: string;
  code: string;
  tagline: string;
}

export const SECTIONS: ReadonlyArray<SectionMeta> = [
  { id: 'about', label: 'About', code: '01', tagline: 'Identity // Profile' },
  { id: 'experience', label: 'Experience', code: '02', tagline: 'Career timeline' },
  { id: 'projects', label: 'Projects', code: '03', tagline: 'Selected work' },
  { id: 'contact', label: 'Contact', code: '04', tagline: 'Open channel' },
];

export const CONTACT_ENDPOINT = 'https://misiewicz.info/backend/contact_form.php';
