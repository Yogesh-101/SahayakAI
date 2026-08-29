'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';
import { getDefaultTab } from '@/lib/claim-navigation';

export default function ClaimIndexPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const legacy: Record<string, string> = {
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

    if (hash && legacy[hash]) {
      router.replace(`/claim/${params.id}/${legacy[hash]}`);
      return;
    }

    let cancelled = false;
    async function redirect() {
      try {
        const claim = await fetchClaimStatus(params.id);
        if (!cancelled) {
          router.replace(`/claim/${params.id}/${getDefaultTab(claim)}`);
        }
      } catch {
        if (!cancelled) {
          router.replace(`/claim/${params.id}/timeline`);
        }
      }
    }
    redirect();
    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
