import { NextResponse } from 'next/server';
import { getClaimByUAN } from '@/lib/mock-data/claims';

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
        error: `Claim not found for UAN ${uan}. Try demo UANs: 123456789, 987654321, 555555555, 111111111`,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ claim });
}
