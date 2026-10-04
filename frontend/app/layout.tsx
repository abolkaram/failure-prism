import type { Metadata } from 'next';
import './globals.css';
import './overrides.css';

export const metadata: Metadata = {
  title: 'Failure Prism',
  description: 'A validator-governed pre-mortem chamber for material attacks and requirement-safe patches.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
