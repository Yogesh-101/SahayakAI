'use client';

import Link from 'next/link';
import { FileQuestion, Search, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <GovPageShell backHref="/">
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-slate-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#1a237e] mb-2">{t('not_found_title')}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t('not_found_desc')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/claim/check">
            <Button variant="gov" className="w-full sm:w-auto gap-2">
              <Search className="w-4 h-4" />
              {t('cta_check_status')}
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Compass className="w-4 h-4" />
              {t('nav_tour')}
            </Button>
          </Link>
        </div>
      </div>
    </GovPageShell>
  );
}
