'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useParams } from 'next/navigation';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';
import type { ClaimStatus } from '@/types/claim';

interface ClaimContextValue {
  claim: ClaimStatus | null;
  loading: boolean;
  error: string | null;
  allCompleted: boolean;
  uan: string;
}

const ClaimContext = createContext<ClaimContextValue | null>(null);

export function ClaimProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ id: string }>();
  const uan = params.id;
  const [claim, setClaim] = useState<ClaimStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClaimStatus(uan);
        if (!cancelled) setClaim(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load claim');
          setClaim(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [uan]);

  const allCompleted = useMemo(
    () =>
      claim
        ? Object.values(claim.stages).every((s) => s.status === 'completed')
        : false,
    [claim],
  );

  const value = useMemo(
    () => ({ claim, loading, error, allCompleted, uan }),
    [claim, loading, error, allCompleted, uan],
  );

  return (
    <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>
  );
}

export function useClaim() {
  const ctx = useContext(ClaimContext);
  if (!ctx) {
    throw new Error('useClaim must be used within ClaimProvider');
  }
  return ctx;
}
