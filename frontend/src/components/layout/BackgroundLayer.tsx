import { type CSSProperties, type ReactNode } from 'react';

import { BACKGROUNDS, type BackgroundKey } from '@/constants/backgrounds';

interface BackgroundLayerProps {
  children: ReactNode;
  className?: string;
  background?: BackgroundKey | 'default';
  imageSrc?: string;
  overlay?: 'dark' | 'landing' | 'auth' | 'lab' | 'none';
}

const overlayClasses: Record<NonNullable<BackgroundLayerProps['overlay']>, string> = {
  dark: 'bg-black/45',
  landing:
    'bg-gradient-to-r from-black/70 via-black/35 to-black/55',
  auth: 'bg-gradient-to-l from-black/75 via-black/40 to-black/25',
  lab: 'bg-gradient-to-b from-black/60 via-[#0A0B10]/50 to-black/70',
  none: '',
};

export default function BackgroundLayer({
  children,
  className = '',
  background = 'default',
  imageSrc,
  overlay = 'dark',
}: BackgroundLayerProps) {
  const resolvedImage =
    imageSrc ??
    (background !== 'default' ? BACKGROUNDS[background] : '/background.jpg');

  const backgroundStyle: CSSProperties = {
    backgroundImage: `url('${resolvedImage}')`,
  };

  return (
    <div className={`relative min-h-screen ${className}`.trim()}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={backgroundStyle}
      />
      {overlay !== 'none' && (
        <div
          aria-hidden
          className={`pointer-events-none fixed inset-0 z-0 ${overlayClasses[overlay]}`}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
