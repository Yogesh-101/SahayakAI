'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';
import RightsPanel from '@/components/RightsPanel';
import ClaimSection from '@/components/claim/ClaimSection';
import { useClaim } from '@/contexts/ClaimContext';

export default function ClaimRightsPage() {
  const { claim, allCompleted } = useClaim();
  const router = useRouter();

  useEffect(() => {
    if (allCompleted) {
      router.replace(`/claim/${claim?.uan}/timeline`);
    }
  }, [allCompleted, claim?.uan, router]);

  if (!claim || allCompleted) return null;

  return (
    <ClaimSection
      icon={Scale}
      title="Legal Rights & Escalation"
      subtitle="Know your rights and take action when needed"
    >
      <RightsPanel claim={claim} />
    </ClaimSection>
  );
}
