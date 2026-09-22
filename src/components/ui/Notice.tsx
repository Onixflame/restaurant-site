import type { ReactNode } from 'react';
export function Notice({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'safe' }) {
  return <div className={`notice ${tone}`}>{children}</div>;
}
