'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import ClaimOverviewCard from '@/components/claim/ClaimOverviewCard';
import ClaimTabNav from '@/components/claim/ClaimTabNav';
import ClaimBottomNav from '@/components/claim/ClaimBottomNav';
import ClaimContinueButton from '@/components/claim/ClaimContinueButton';
import NextStepCard from '@/components/claim/NextStepCard';
import EpfoCallFab from '@/components/claim/EpfoCallFab';
import GovPageShell from '@/components/GovPageShell';
import { ClaimProvider, useClaim } from '@/contexts/ClaimContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { scrollToClaimSection } from '@/lib/claim-scroll';

const HASH_TO_ROUTE: Record<string, string> = {
  timeline: 'timeline',
  diagnosis: 'diagnosis',
  analytics: 'analytics',
  rights: 'rights',
  notifications: 'alerts',
  alerts: 'alerts',
  'peer-comparison': 'analytics',
  'financial-impact': 'analytics',
  'email-tracker': 'diagnosis',
};

function ClaimLayoutInner({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { claim, loading, error, uan } = useClaim();
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const isTimeline = pathname.endsWith('/timeline');

  useEffect(() => {
    scrollToClaimSection(contentRef.current);
  }, [pathname]);

  if (loading) {
    return (
      <GovPageShell
        breadcrumbs={[
          { label: t('cta_check_status'), href: '/claim/check' },
          { label: `UAN: ${uan}` },
        ]}
      >
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-3">
            <Spinner className="mx-auto h-8 w-8" />
            <p className="text-muted-foreground text-sm">{t('loading_claim')}</p>
          </div>
        </div>
      </GovPageShell>
    );
  }

  if (error || !claim) {
    return (
      <GovPageShell
        breadcrumbs={[
          { label: t('cta_check_status'), href: '/claim/check' },
          { label: 'Error' },
        ]}
      >
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-lg mx-auto gov-card">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <p className="font-medium text-lg">{t('error_claim_not_found')}</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Link href="/claim/check">
                <Button variant="gov" className="gap-2">
                  {t('error_try_another_uan')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </GovPageShell>
    );
  }

  return (
    <GovPageShell
      breadcrumbs={[
        { label: t('cta_check_status'), href: '/claim/check' },
        { label: `UAN: ${claim.uan}` },
      ]}
    >
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-16 max-w-4xl space-y-4">
        <ClaimOverviewCard compact={!isTimeline} />
        <NextStepCard />
        <ClaimTabNav />

        <div
          id="claim-section"
          ref={contentRef}
          className="scroll-mt-40 md:scroll-mt-44 pt-1 pb-4"
        >
          {children}
          <ClaimContinueButton />
        </div>

        <div className="hidden md:flex items-center justify-center pt-4 border-t border-gray-100">
          <Link href="/claim/check">
            <Button variant="outline" className="gap-2 btn-press min-h-[44px]">
              <Search className="w-4 h-4" />
              {t('check_another_claim')}
            </Button>
          </Link>
        </div>
      </div>

      <ClaimBottomNav />
      <EpfoCallFab />
    </GovPageShell>
  );
}

function HashRedirect() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && HASH_TO_ROUTE[hash]) {
      router.replace(`/claim/${params.id}/${HASH_TO_ROUTE[hash]}`);
    }
  }, [params.id, router]);

  return null;
}

export default function ClaimLayout({ children }: { children: ReactNode }) {
  return (
    <ClaimProvider>
      <HashRedirect />
      <ClaimLayoutInner>{children}</ClaimLayoutInner>
    </ClaimProvider>
  );
}
