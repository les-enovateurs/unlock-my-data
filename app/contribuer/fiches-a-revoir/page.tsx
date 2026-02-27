'use client';

import { useLanguage } from '@/context/LanguageContext';
import ReviewFormsPage from '@/components/ReviewFormsPage';

export default function FichesAReviewerPage() {
  const { lang } = useLanguage();

  return <ReviewFormsPage lang="fr" contributePath="/contribuer" />;
}
