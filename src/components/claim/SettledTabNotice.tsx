'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettledTabNoticeProps {
  uan: string;
}

export default function SettledTabNotice({ uan }: SettledTabNoticeProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
      <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" aria-hidden />
      <div>
        <h3 className="font-semibold text-green-900">{t('settled_tab_unavailable')}</h3>
        <p className="text-sm text-green-800 mt-1 max-w-md mx-auto">{t('settled_tab_desc')}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link href={`/claim/${uan}/timeline`}>
          <Button variant="gov" className="gap-2 w-full sm:w-auto">
            {t('tab_status')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/claim/${uan}/alerts`}>
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            {t('tab_alerts')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
