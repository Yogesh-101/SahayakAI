import { NextResponse } from 'next/server';
import { diagnoseClaimBottleneck } from '@/lib/services/diagnosis-service';
import type { ClaimStatus } from '@/types/claim';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const claim = deserializeClaim(body.claim);
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

function deserializeClaim(raw: Record<string, unknown>): ClaimStatus {
  const stages = raw.stages as Record<string, Record<string, unknown>>;
  const deserialized: Record<string, unknown> = {};

  for (const [key, stage] of Object.entries(stages)) {
    deserialized[key] = {
      ...stage,
      enteredAt: new Date(stage.enteredAt as string),
      completedAt: stage.completedAt ? new Date(stage.completedAt as string) : undefined,
    };
  }

  return {
    uan: raw.uan as string,
    claimId: raw.claimId as string,
    claimType: raw.claimType as ClaimStatus['claimType'],
    amount: raw.amount as number,
    memberName: raw.memberName as string,
    employerName: raw.employerName as string,
    currentStage: raw.currentStage as keyof ClaimStatus['stages'],
    filingDate: new Date(raw.filingDate as string),
    estimatedSettlement: raw.estimatedSettlement
      ? new Date(raw.estimatedSettlement as string)
      : undefined,
    stages: deserialized as unknown as ClaimStatus['stages'],
  };
}
