import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Accent = 'indigo' | 'green' | 'red' | 'purple' | 'amber';

const ACCENT_STYLES: Record<Accent, { ring: string; bg: string; icon: string }> = {
  indigo: { ring: 'ring-epfo-indigo/20', bg: 'bg-gradient-to-br from-indigo-50 to-violet-50', icon: 'text-epfo-indigo' },
  green: { ring: 'ring-green-200', bg: 'bg-gradient-to-br from-green-50 to-emerald-50', icon: 'text-green-600' },
  red: { ring: 'ring-red-200', bg: 'bg-gradient-to-br from-red-50 to-rose-50', icon: 'text-red-600' },
  purple: { ring: 'ring-purple-200', bg: 'bg-gradient-to-br from-purple-50 to-indigo-50', icon: 'text-purple-600' },
  amber: { ring: 'ring-amber-200', bg: 'bg-gradient-to-br from-amber-50 to-orange-50', icon: 'text-amber-700' },
};

interface ToolPageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: Accent;
  className?: string;
  children?: React.ReactNode;
}

export default function ToolPageHeader({
  icon: Icon,
  title,
  description,
  accent = 'indigo',
  className,
  children,
}: ToolPageHeaderProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div className={cn('text-center mb-8', className)}>
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-4',
          styles.bg,
          styles.ring,
        )}
      >
        <Icon className={cn('w-8 h-8', styles.icon)} strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1a237e] tracking-tight mb-2">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}
