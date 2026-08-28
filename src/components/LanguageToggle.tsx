'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageToggleProps {
  /** Use "dark" when placed on a dark/colored background (e.g. navy top bar, hero). */
  variant?: 'light' | 'dark';
}

export default function LanguageToggle({ variant = 'light' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const styles =
    variant === 'dark'
      ? 'bg-white text-epfo-indigo border-white hover:bg-gray-100'
      : 'bg-white text-epfo-indigo border-gray-300 hover:bg-gray-50';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors text-sm font-semibold shadow-sm ${styles}`}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
    </button>
  );
}
