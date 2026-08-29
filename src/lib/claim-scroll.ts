/** Pixels to leave clear below sticky site header + claim tab bar when scrolling tab content. */
export function getClaimScrollOffset(): number {
  if (typeof window === 'undefined') return 152;
  return window.matchMedia('(min-width: 768px)').matches ? 152 : 80;
}

export function scrollToClaimSection(el: HTMLElement | null): void {
  if (!el) return;
  const run = () => {
    const offset = getClaimScrollOffset();
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };
  requestAnimationFrame(() => requestAnimationFrame(run));
}
