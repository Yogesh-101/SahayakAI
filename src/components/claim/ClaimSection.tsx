import type { LucideIcon } from 'lucide-react';

interface ClaimSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function ClaimSection({
  icon: Icon,
  title,
  subtitle,
  children,
}: ClaimSectionProps) {
  return (
    <section className="w-full scroll-mt-40 md:scroll-mt-44">
      <div className="flex items-start gap-3 mb-5 max-w-3xl mx-auto pt-1">
        <div className="w-10 h-10 rounded-lg bg-[#1a237e]/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-5 h-5 text-[#1a237e]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#1a237e] leading-snug">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto">{children}</div>
    </section>
  );
}
