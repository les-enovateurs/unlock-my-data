'use client';

import { useLanguage } from '@/context/LanguageContext';
import ReviewFormsPage from '@/components/ReviewFormsPage';

export default function FormsToReviewPage() {
  const { lang } = useLanguage();

  return <ReviewFormsPage lang="en" contributePath="/contribute" />;
}
