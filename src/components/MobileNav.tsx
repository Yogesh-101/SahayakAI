'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ShieldCheck, Scale, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MobileNav() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/claim/check', label: t('cta_check_status'), icon: Search },
    { href: '/tools/kyc-check', label: t('nav_kyc_check'), icon: ShieldCheck },
    { href: '/tools/escalate', label: t('nav_escalate'), icon: Scale },
    { href: '/demo', label: 'Demo', icon: Play },
  ];

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={() => setOpen(!open)}
        aria-label={t('mobile_menu')}
        aria-expanded={open}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            className="fixed top-14 right-0 z-50 w-[min(100%,280px)] bg-white border-l border-b shadow-xl rounded-bl-xl p-4 space-y-1"
            aria-label={t('mobile_menu')}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-epfo-indigo/5 hover:text-epfo-indigo min-h-[44px]"
              >
                <link.icon className="w-4 h-4 shrink-0" />
                {link.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
