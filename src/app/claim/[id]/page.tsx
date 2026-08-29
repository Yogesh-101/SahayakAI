'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

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
    const section = hash && legacy[hash] ? legacy[hash] : 'timeline';
    router.replace(`/claim/${params.id}/${section}`);
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
