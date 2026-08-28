'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUp, Home, ChevronRight, Phone, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface GovPageShellProps {
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
  backHref?: string;
  backLabel?: string;
}

export default function GovPageShell({
  children,
  breadcrumbs = [],
  backHref = '/',
  backLabel,
}: GovPageShellProps) {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll('.fade-in-section').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* ── Government Identity Bar (slim) ────────────── */}
      <div className="bg-[#1a1a2e] text-white py-1">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/india-flag.svg" alt="Indian Flag" width={18} height={18} className="rounded-full" />
            <span className="text-[11px] tracking-wide">
              <span className="font-medium">भारत सरकार</span>
              <span className="text-white/40 mx-1">|</span>
              <span className="font-medium">Government of India</span>
            </span>
          </div>
          <LanguageToggle variant="dark" />
        </div>
      </div>

      {/* ── Main Header ──────────────────────────────── */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-14" aria-label="Site navigation">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <Image src="/logo.svg" alt="SahayakAI Logo" width={32} height={32} className="rounded-full group-hover:ring-2 ring-epfo-indigo/30 transition-all" />
              <div className="leading-none">
                <div className="text-base font-bold text-epfo-indigo">{t('app_name')}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{t('header_tagline')}</div>
              </div>
            </Link>
            <div className="hidden md:flex items-center h-full ml-auto mr-6">
              {[
                { href: '/tools/kyc-check', label: t('nav_kyc_check') },
                { href: '/tools/escalate', label: t('nav_escalate') },
                { href: '/demo', label: 'Demo' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="relative h-full flex items-center px-3.5 text-[13px] font-medium text-gray-600 hover:text-epfo-indigo transition-colors after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-epfo-indigo after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href="/claim/check" className="shrink-0">
              <Button size="sm" className="bg-epfo-indigo hover:bg-epfo-navy text-white btn-press h-8 px-4 text-xs">
                {t('cta_check_status')}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Breadcrumb Bar ────────────────────────────── */}
      {breadcrumbs.length > 0 && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1 hover:text-epfo-indigo transition-colors">
                <Home className="w-3 h-3" />
                <span>{t('app_name')}</span>
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-epfo-indigo transition-colors">{crumb.label}</Link>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}

      {breadcrumbs.length === 0 && backHref && (
        <div className="container mx-auto px-4 pt-4">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-epfo-indigo transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {backLabel || t('back_to_home')}
          </Link>
        </div>
      )}

      <main className="flex-1">{children}</main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="bg-[#1a237e] text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/logo.svg" alt="SahayakAI" width={26} height={26} className="rounded-full" />
                <span className="font-bold">{t('app_name')}</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{t('footer_tagline')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs mb-2 text-white/90 uppercase tracking-wider">{t('footer_quick_links')}</h4>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li><Link href="/claim/check" className="hover:text-white transition-colors">{t('footer_track_claim')}</Link></li>
                <li><Link href="/tools/kyc-check" className="hover:text-white transition-colors">{t('footer_kyc_checker')}</Link></li>
                <li><Link href="/tools/escalate" className="hover:text-white transition-colors">{t('footer_legal_escalation')}</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">{t('footer_interactive_demo')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs mb-2 text-white/90 uppercase tracking-wider">{t('footer_epfo_resources')}</h4>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li><a href="https://www.epfo.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">EPFO Portal <ExternalLink className="w-2.5 h-2.5" /></a></li>
                <li><a href="https://epfigms.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">EPFiGMS <ExternalLink className="w-2.5 h-2.5" /></a></li>
                <li><a href="https://rtionline.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">RTI Online <ExternalLink className="w-2.5 h-2.5" /></a></li>
                <li><a href="https://pgportal.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">CPGRAMS <ExternalLink className="w-2.5 h-2.5" /></a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs mb-2 text-white/90 uppercase tracking-wider">{t('footer_helplines')}</h4>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {t('footer_helpline_epfo')}</li>
                <li className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {t('footer_helpline_toll')}</li>
                <li className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> {t('footer_helpline_hours')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 text-center text-[10px] text-white/40">
            <p>{t('footer_disclaimer_v2')}</p>
          </div>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-epfo-indigo text-white shadow-lg flex items-center justify-center transition-all duration-300 btn-press ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
