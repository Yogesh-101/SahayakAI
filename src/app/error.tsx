'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <GovPageShell backHref="/">
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-[#1a237e] mb-2">{t('error_page_title')}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t('error_page_desc')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gov" onClick={reset} className="gap-2">
            {t('error_page_retry')}
          </Button>
          <Link href="/claim/check">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Search className="w-4 h-4" />
              {t('cta_check_status')}
            </Button>
          </Link>
        </div>
      </div>
    </GovPageShell>
  );
}
