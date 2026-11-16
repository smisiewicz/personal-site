import { experiences } from '@/data/experiences';
import { projects } from '@/data/projects';
import { SECTIONS } from '@/lib/constants';
import type { Focus, HubSectionId, SectionId } from '@/types';

export const ROOT_FOCUS: Focus = { section: null, item: null };

export function isHub(section: SectionId | null): section is HubSectionId {
  return section === 'experience' || section === 'projects';
}

export function itemCount(section: SectionId): number {
  if (section === 'experience') return experiences.length;
  if (section === 'projects') return projects.length;
  return 0;
}

/** True when the focus shows a readable content panel rather than hive cells. */
export function hasPanel(focus: Focus): boolean {
  if (focus.section === null) return false;
  return !isHub(focus.section) || focus.item !== null;
}

export function focusDepth(focus: Focus): number {
  if (focus.section === null) return 0;
  return focus.item === null ? 1 : 2;
}

export function sameFocus(a: Focus, b: Focus): boolean {
  return a.section === b.section && a.item === b.item;
}

export function parentFocus(focus: Focus): Focus {
  if (focus.item !== null) return { section: focus.section, item: null };
  return ROOT_FOCUS;
}

/** Linear order used by scroll, swipe and arrow keys: every cell is reachable without clicking. */
export const TOUR: ReadonlyArray<Focus> = [
  ROOT_FOCUS,
  ...SECTIONS.flatMap((section): Focus[] => [
    { section: section.id, item: null },
    ...Array.from({ length: itemCount(section.id) }, (_, item): Focus => ({ section: section.id, item })),
  ]),
];

export function stepFocus(focus: Focus, direction: 1 | -1): Focus {
  const index = TOUR.findIndex((stop) => sameFocus(stop, focus));
  return TOUR[index + direction] ?? focus;
}

export function focusToHash(focus: Focus): string {
  if (focus.section === null) return '';
  return focus.item === null ? `#${focus.section}` : `#${focus.section}/${focus.item + 1}`;
}

function parseSection(value: string | undefined): SectionId | null {
  return SECTIONS.find((section) => section.id === value)?.id ?? null;
}

export function hashToFocus(hash: string): Focus {
  const [sectionPart, itemPart] = hash.replace(/^#\/?/, '').split('/');
  const section = parseSection(sectionPart);
  if (section === null) return ROOT_FOCUS;
  const item = Number.parseInt(itemPart ?? '', 10) - 1;
  const hasItem = isHub(section) && Number.isInteger(item) && item >= 0 && item < itemCount(section);
  return { section, item: hasItem ? item : null };
}

/** The previous multi-page site used /experience, /projects and /contact — keep those links alive. */
export function legacyPathToFocus(pathname: string): Focus | null {
  const section = parseSection(pathname.replace(/^\/+|\/+$/g, ''));
  return section === null ? null : { section, item: null };
}

/** "Paltalk (AVM Software Inc.)" → "Paltalk": short enough to sit inside a cell. */
export function shortCompany(company: string): string {
  return company.replace(/\s*\(.*\)/, '').replace(/,?\s*Inc\.?$/, '');
}

export function yearRange(date: string): string {
  const years = date.match(/\d{4}/g) ?? [];
  const end = /present/i.test(date) ? 'NOW' : (years[1] ?? years[0] ?? '');
  return `${years[0] ?? ''} — ${end}`;
}

export function itemLabel(section: HubSectionId, index: number): string {
  if (section === 'experience') return shortCompany(experiences[index]?.company ?? '');
  return projects[index]?.title ?? '';
}

export function focusLabel(focus: Focus): string {
  if (focus.section === null) return 'Overview';
  if (focus.item !== null && isHub(focus.section)) return itemLabel(focus.section, focus.item);
  return SECTIONS.find((section) => section.id === focus.section)?.label ?? '';
}
