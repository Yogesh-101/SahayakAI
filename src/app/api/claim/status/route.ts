import { NextResponse } from 'next/server';
import { getClaimByUAN } from '@/lib/mock-data/claims';
import { formatDemoUanList } from '@/lib/claim-session';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uan = searchParams.get('uan');

  if (!uan) {
    return NextResponse.json({ error: 'UAN is required' }, { status: 400 });
  }

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));

  const claim = getClaimByUAN(uan);
  if (!claim) {
    return NextResponse.json(
      {
        error: `Claim not found for UAN ${uan}. Sample UANs: ${formatDemoUanList()}`,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ claim });
}
