'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClaimNavTabProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  showDot?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export default function ClaimNavTab({
  href,
  label,
  icon: Icon,
  isActive,
  showDot,
  layout = 'horizontal',
}: ClaimNavTabProps) {
  if (layout === 'vertical') {
    return (
      <Link
        href={href}
        className={cn(
          'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 min-h-[56px] text-[11px] font-medium transition-colors',
          isActive ? 'text-[#1a237e]' : 'text-slate-500 hover:text-slate-700',
        )}
      >
        {isActive && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#1a237e]" />
        )}
        <span className="relative mt-1">
          <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.25px]')} />
          {showDot && <span className="claim-nav-dot" aria-hidden />}
        </span>
        <span className="leading-tight">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn('claim-nav-tab', isActive && 'claim-nav-tab-active')}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="relative shrink-0">
        <Icon className="w-4 h-4" strokeWidth={isActive ? 2.25 : 2} />
        {showDot && <span className="claim-nav-dot" aria-hidden />}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
