'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

const LEGACY_HASH: Record<string, string> = {
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

export default function ClaimIndexPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const destination = hash && LEGACY_HASH[hash] ? LEGACY_HASH[hash] : 'timeline';
    router.replace(`/claim/${params.id}/${destination}`);
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
