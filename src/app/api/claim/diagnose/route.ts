import { NextResponse } from 'next/server';
import { diagnoseClaimBottleneck } from '@/lib/services/diagnosis-service';
import { parseClaimStatus } from '@/lib/claim-parser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const claim = parseClaimStatus(body.claim as Record<string, unknown>);
    const { diagnosis, source } = await diagnoseClaimBottleneck(claim);
    return NextResponse.json({ diagnosis, source });
  } catch (error) {
    console.error('[API /claim/diagnose] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Diagnosis failed' },
      { status: 500 },
    );
  }
}
