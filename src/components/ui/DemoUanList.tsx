'use client';

import { ArrowRight, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type DemoUanItem = {
  uan: string;
  label: string;
  onClick?: () => void;
  href?: string;
};

interface DemoUanListProps {
  title: string;
  items: DemoUanItem[];
  disabled?: boolean;
  variant?: 'amber' | 'indigo';
  className?: string;
}

export default function DemoUanList({
  title,
  items,
  disabled,
  variant = 'amber',
  className,
}: DemoUanListProps) {
  const border = variant === 'amber' ? 'border-amber-200/80' : 'border-indigo-200/80';
  const bg = variant === 'amber' ? 'bg-amber-50/40' : 'bg-indigo-50/30';
  const itemBorder = variant === 'amber' ? 'border-amber-200/70' : 'border-indigo-200/70';

  return (
    <div className={cn('rounded-xl border p-4 sm:p-5', border, bg, className)}>
      <div className="mb-3">
        <Badge variant="outline" className="text-[10px] bg-white/80 border-gray-300 font-medium">
          {title}
        </Badge>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const content = (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <span className="demo-uan-icon shrink-0">
                  <Hash className="w-3.5 h-3.5" />
                </span>
                <span className="font-mono font-semibold text-sm text-[#1a237e] shrink-0">
                  {item.uan}
                </span>
                <span className="text-xs text-muted-foreground truncate">{item.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-epfo-indigo group-hover:translate-x-0.5 transition-all shrink-0" />
            </>
          );

          const itemClass = cn(
            'demo-list-item group w-full flex items-center justify-between text-left',
            itemBorder,
            disabled && 'opacity-60 pointer-events-none',
          );

          if (item.href) {
            return (
              <a key={item.uan} href={item.href} className={itemClass}>
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.uan}
              type="button"
              disabled={disabled}
              onClick={item.onClick}
              className={itemClass}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
