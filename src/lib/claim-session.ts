const UAN_KEY = 'sahayak-last-uan';

/** Indian UANs are 12 digits; demo UANs follow the same format. */
export const DEMO_UAN_LENGTH = 12;

export const DEMO_UAN_EMPLOYER = '123456789012';
export const DEMO_UAN_KYC = '987654321098';
export const DEMO_UAN_PROCESSING = '555555555555';
export const DEMO_UAN_SETTLED = '111111111111';

export const DEMO_UANS = [
  DEMO_UAN_EMPLOYER,
  DEMO_UAN_KYC,
  DEMO_UAN_PROCESSING,
  DEMO_UAN_SETTLED,
] as const;

export function saveLastUan(uan: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UAN_KEY, uan);
}

export function getLastUan(): string | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(UAN_KEY);
  if (!saved || !isValidUan(saved)) return null;
  return saved;
}

export function isValidUan(uan: string): boolean {
  const trimmed = uan.trim();
  return /^\d{12}$/.test(trimmed) && DEMO_UANS.includes(trimmed as (typeof DEMO_UANS)[number]);
}

export function claimToolHref(
  path: string,
  fallbackUan = DEMO_UAN_EMPLOYER,
): string {
  const uan = getLastUan() || fallbackUan;
  return path.replace('{uan}', uan);
}

export function formatDemoUanList(count: number = DEMO_UANS.length): string {
  return DEMO_UANS.slice(0, count).join(', ');
}
