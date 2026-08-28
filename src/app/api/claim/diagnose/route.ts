import { NextResponse } from 'next/server';
import { diagnoseClaimBottleneck } from '@/lib/services/diagnosis-service';
import { parseClaimStatus } from '@/lib/claim-parser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const claim = parseClaimStatus(body.claim as Record<string, unknown>);
    const diagnosis = await diagnoseClaimBottleneck(claim);
    return NextResponse.json({ diagnosis, source: getSource() });
  } catch (error) {
    console.error('[API /claim/diagnose] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Diagnosis failed' },
      { status: 500 },
    );
  }
}

function getSource(): 'openai' | 'rules' {
  const key = process.env.OPENAI_API_KEY;
  return key && key !== 'sk-proj-your-actual-key-here' ? 'openai' : 'rules';
}
