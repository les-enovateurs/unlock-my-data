import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contributors Hall of Fame | Unlock My Data',
  description: 'Celebrating our amazing contributors who help document data export processes',
};

export default function ContributorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

