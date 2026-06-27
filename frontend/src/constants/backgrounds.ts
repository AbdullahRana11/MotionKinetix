export const BACKGROUNDS = {
  landing: '/backgrounds/landing-bg.jpg',
  auth: '/backgrounds/auth-bg.jpg',
  lab: '/backgrounds/lab-bg.jpg',
} as const;

export type BackgroundKey = keyof typeof BACKGROUNDS;
