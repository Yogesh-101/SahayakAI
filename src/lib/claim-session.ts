const UAN_KEY = 'sahayak-last-uan';

/** Demo/mock UANs in this prototype are 9 digits. */
export const DEMO_UAN_LENGTH = 9;

export const DEMO_UANS = [
  '123456789',
  '987654321',
  '555555555',
  '111111111',
] as const;

export function saveLastUan(uan: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UAN_KEY, uan);
}

export function getLastUan(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(UAN_KEY);
}

export function isValidUan(uan: string): boolean {
  const trimmed = uan.trim();
  return /^\d{9}$/.test(trimmed) && DEMO_UANS.includes(trimmed as (typeof DEMO_UANS)[number]);
}

export function claimToolHref(
  path: string,
  fallbackUan = '123456789',
): string {
  const uan = getLastUan() || fallbackUan;
  return path.replace('{uan}', uan);
}
