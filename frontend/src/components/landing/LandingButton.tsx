import Link from 'next/link';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';

type LandingButtonVariant = 'primary' | 'secondary';

interface BaseProps {
  variant?: LandingButtonVariant;
  className?: string;
  children: React.ReactNode;
}

type LandingButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

type LandingButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type LandingButtonProps = LandingButtonAsLink | LandingButtonAsButton;

const variantClass: Record<LandingButtonVariant, string> = {
  primary: 'btn-elite-primary',
  secondary: 'btn-elite-secondary',
};

export default function LandingButton({
  variant = 'primary',
  className = '',
  children,
  href,
  ...props
}: LandingButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();

  if (href) {
    const isExternal = href.startsWith('http');
    if (isExternal) {
      return (
        <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </a>
      );
    }

    if (href.startsWith('#')) {
      return (
        <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
