'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors text-sm"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
    </button>
  );
}
