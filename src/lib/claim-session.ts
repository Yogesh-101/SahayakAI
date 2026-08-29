const UAN_KEY = 'sahayak-last-uan';

export function saveLastUan(uan: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UAN_KEY, uan);
}

export function getLastUan(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(UAN_KEY);
}

export function isValidUan(uan: string): boolean {
  return /^\d{12}$/.test(uan.trim());
}

export function claimToolHref(
  path: string,
  fallbackUan = '123456789',
): string {
  const uan = getLastUan() || fallbackUan;
  return path.replace('{uan}', uan);
}
