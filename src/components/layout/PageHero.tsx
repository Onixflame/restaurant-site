import type { ReactNode } from 'react';
export function PageHero({ eyebrow, title, children, className = '' }: { eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return <section className={`page-hero ${className}`}><div className="wrap page-hero-content"><div className="eyebrow">{eyebrow}</div><h1>{title.replace(/\.+$/,'')}</h1><p>{children}</p></div></section>;
}
