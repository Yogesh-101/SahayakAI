'use client';

import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoadingScreen() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="text-center space-y-3">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1a237e]" />
        <p className="text-muted-foreground text-sm">{t('loading_page')}</p>
      </div>
    </div>
  );
}
