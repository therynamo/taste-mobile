// Every colour, size, radius, space and motion value in the app is defined here.
// Roles are named in MOBILE-DESIGN.md. Components never hold a raw value.

export type Palette = {
  paper: string;
  ink: string;
  inkSoft: string;
  rule: string;
  ribbon: string;
  mark: string;
  onInk: string;
};

export type TintId = 'system' | 'bone' | 'fog' | 'night';

export const palettes: Record<Exclude<TintId, 'system'>, Palette> = {
  bone: { paper: '#F3F4F1', ink: '#1A1C1B', inkSoft: '#575C59', rule: '#C5C9C3', ribbon: '#8A2B2B', mark: '#EADFDC', onInk: '#F3F4F1' },
  fog: { paper: '#E4E8E8', ink: '#181B1C', inkSoft: '#4F5657', rule: '#B9C1C1', ribbon: '#7E2626', mark: '#D9D0CE', onInk: '#E4E8E8' },
  night: { paper: '#131514', ink: '#E9E8E3', inkSoft: '#A3A8A4', rule: '#3A3F3C', ribbon: '#E8948B', mark: '#2E1F1E', onInk: '#131514' },
};

export const tints: { id: TintId; name: string }[] = [
  { id: 'system', name: 'System' },
  { id: 'bone', name: 'Bone' },
  { id: 'fog', name: 'Fog' },
  { id: 'night', name: 'Night' },
];

// The display treatment: a face the reader chooses per book. All four ship with iOS.
export type FaceId = 'iowan' | 'newyork' | 'charter' | 'sf';
export const faces: { id: FaceId; name: string; family: string | undefined }[] = [
  { id: 'iowan', name: 'Iowan Old Style', family: 'Iowan Old Style' },
  { id: 'newyork', name: 'New York', family: 'ui-serif' },
  { id: 'charter', name: 'Charter', family: 'Charter' },
  { id: 'sf', name: 'San Francisco', family: undefined },
];

// Sizes follow the iOS text styles (size / leading). React Native scales both with the
// system text size; nothing here switches scaling off.
export const type = {
  title1: { fontSize: 28, lineHeight: 34 },
  title3: { fontSize: 20, lineHeight: 26 },
  page: { fontSize: 18, lineHeight: 28 },
  body: { fontSize: 17, lineHeight: 23 },
  subhead: { fontSize: 15, lineHeight: 21 },
  footnote: { fontSize: 13, lineHeight: 18 },
  caption: { fontSize: 12, lineHeight: 16 },
} as const;

// React Native scales every size by one factor (3.57 at the largest setting). iOS text styles
// do not: Body tops out at 53 pt and Title 1 at 60 pt. These ceilings are the iOS AX5 size
// divided by the default size, so each style stops where the platform's own style stops.
// `furniture` is for running heads and folios, which behave like bar text.
export const cap = {
  title1: 2.15,
  title3: 2.75,
  page: 3.0,
  body: 3.12,
  subhead: 3.27,
  footnote: 3.38,
  furniture: 2.0,
  bar: 1.35,
} as const;

export const space = { hair: 2, xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 36, margin: 30 } as const;
export const radius = { control: 22, wash: 4 } as const;
export const hit = 44;
export const stackedAt = 1.5; // text scale above which margin numerals move inline

// Motion tokens (references/motion.md). Mass 1; damping = 2 * sqrt(stiffness) is bounce 0.
export const motion = {
  springDefault: { stiffness: 247, damping: 31.4, mass: 1 }, // response 0.4 s, bounce 0
  springEffects: { stiffness: 1600, damping: 80, mass: 1 }, // response 0.16 s, bounce 0
  reducedMs: 180,
  pressMs: 120,
} as const;
