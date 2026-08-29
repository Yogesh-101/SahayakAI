'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Shield,
  MessageCircle,
  Mic,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Scale,
  BarChart3,
  IndianRupee,
  Mail,
  BookOpen,
  Phone,
  FileText,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll('.fade-in-section, .stagger-children').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const CORE_FEATURES = [
    { icon: Search, title: t('feature_tracking_title'), description: t('feature_tracking_desc') },
    { icon: Brain, title: t('feature_ai_title'), description: t('feature_ai_desc') },
    { icon: Shield, title: t('feature_resolution_title'), description: t('feature_resolution_desc') },
    { icon: MessageCircle, title: t('feature_whatsapp_title'), description: t('feature_whatsapp_desc') },
  ];

  const TOOLS = [
    { icon: ShieldCheck, title: t('tool_kyc_title'), description: t('tool_kyc_desc'), href: '/tools/kyc-check', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { icon: Scale, title: t('tool_legal_title'), description: t('tool_legal_desc'), href: '/tools/escalate', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { icon: IndianRupee, title: t('tool_finance_title'), description: t('tool_finance_desc'), href: '/claim/123456789#financial-impact', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    { icon: BarChart3, title: t('tool_peer_title'), description: t('tool_peer_desc'), href: '/claim/123456789#peer-comparison', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { icon: Mail, title: t('tool_email_title'), description: t('tool_email_desc'), href: '/claim/123456789#email-tracker', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { icon: BookOpen, title: t('tool_rights_title'), description: t('tool_rights_desc'), href: '/claim/123456789#rights', color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  ];

  const STATS = [
    { value: '8Cr+', label: t('stat_epfo_members') },
    { value: '4', label: t('stat_stage_visibility') },
    { value: 'AI', label: t('stat_ai_diagnosis') },
    { value: 'EN+HI', label: t('stat_languages') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Main Navigation Header ───────────────────── */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-14" aria-label="Main navigation">
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
            <div className="flex items-center gap-3 shrink-0">
              <LanguageToggle />
              <Link href="/claim/check">
                <Button size="sm" className="bg-epfo-indigo hover:bg-epfo-navy text-white btn-press h-8 px-4 text-xs">
                  {t('cta_check_status')}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ── News Ticker ──────────────────────────────── */}
      <div className="bg-gray-50 border-b overflow-hidden py-1.5">
        <div className="flex items-center container mx-auto px-4">
          <span className="shrink-0 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-3">
            {t('ticker_label')}
          </span>
          <div className="overflow-hidden flex-1">
            <p className="ticker-animate whitespace-nowrap text-xs text-gray-700">
              {t('ticker_text')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Judge entry banner ───────────────────────── */}
      <div className="bg-[#1a237e] text-white">
        <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm font-medium">{t('judge_banner_text')}</p>
          <Link href="/demo">
            <Button size="sm" variant="secondary" className="h-7 text-xs bg-white text-[#1a237e] hover:bg-gray-100">
              {t('judge_banner_cta')}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Hero Section (centered) ─────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0eaf8] via-[#ebe3f5] to-white py-14 sm:py-16 lg:py-20">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, #c4b5fd 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-4 border-[#7c3aed]/30 text-[#7c3aed] bg-white/80 animate-fade-up"
            >
              {t('hero_badge')}
            </Badge>

            <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed] mb-3 animate-fade-up">
              {t('hero_welcome')}
            </p>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5 leading-[1.15] text-[#1a237e] animate-fade-up"
              style={{ animationDelay: '0.1s' }}
            >
              {t('hero_title_line1')}{' '}
              <span className="text-[#7c3aed]">{t('hero_title_line2')}</span>
            </h1>

            <p
              className="text-sm sm:text-base text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              {t('hero_description')}
            </p>

            <p
              className="text-sm text-[#1a237e]/80 italic mb-8 max-w-xl mx-auto border-l-2 border-[#7c3aed]/40 pl-4 text-left sm:text-center sm:border-l-0 sm:pl-0 animate-fade-up"
              style={{ animationDelay: '0.25s' }}
            >
              &ldquo;{t('hero_founder_story')}&rdquo;
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Link href="/claim/check">
                <Button
                  size="lg"
                  className="text-sm px-7 py-5 w-full sm:w-auto gap-2 bg-[#1a237e] text-white hover:bg-[#0d1559] font-semibold btn-press shadow-lg rounded-lg"
                >
                  <Search className="w-4 h-4" />
                  {t('cta_track_claim')}
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-sm px-7 py-5 w-full sm:w-auto gap-2 border-2 border-[#1a237e]/30 text-[#1a237e] hover:bg-[#1a237e]/5 btn-press rounded-lg"
                >
                  {t('cta_watch_demo')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: '0.4s' }}
            >
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-[#1a237e]/10 text-center"
                >
                  <div className="text-lg font-bold text-[#1a237e] count-animate">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="fade-in-section text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">{t('features_title')}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{t('features_subtitle')}</p>
              <div className="section-divider mt-5 max-w-xs mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
              {CORE_FEATURES.map((feature, i) => (
                <div key={feature.title} className="gov-card bg-white rounded-xl p-5 border border-gray-200 text-center">
                  <div className="w-11 h-11 rounded-full bg-[#1a237e]/10 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-5 h-5 text-[#1a237e]" />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <span className="w-5 h-5 rounded-full bg-epfo-indigo text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <h3 className="font-semibold text-sm text-[#1a237e]">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Before / After ───────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="fade-in-section text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">{t('problem_title')}</h2>
              <p className="text-sm text-muted-foreground">{t('problem_subtitle')}</p>
              <div className="section-divider mt-5 max-w-xs mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-5 stagger-children">
              <div className="gov-card rounded-xl border-2 border-red-200 bg-white overflow-hidden">
                <div className="bg-red-50 px-5 py-3 border-b border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h3 className="font-bold text-sm text-red-900">{t('problem_before_title')}</h3>
                  </div>
                  <p className="text-xs text-red-700 mt-0.5">{t('problem_before_subtitle')}</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="rounded-lg bg-red-50/50 p-3 border border-red-100">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{t('problem_status_label')}</p>
                    <p className="font-bold text-lg text-red-900">{t('problem_status_value')}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{t('problem_last_updated')}</p>
                  </div>
                  <ul className="space-y-1.5 text-sm text-red-800">
                    {[t('problem_before_li1'), t('problem_before_li2'), t('problem_before_li3'), t('problem_before_li4')].map((li) => (
                      <li key={li} className="flex items-start gap-2"><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />{li}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="gov-card rounded-xl border-2 border-green-300 bg-white overflow-hidden ring-2 ring-green-200/50">
                <div className="bg-green-50 px-5 py-3 border-b border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <h3 className="font-bold text-sm text-green-900">{t('problem_after_title')}</h3>
                  </div>
                  <p className="text-xs text-green-700 mt-0.5">{t('problem_after_subtitle')}</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="rounded-lg bg-green-50/50 p-3 border border-green-100 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span>{t('problem_stage_employer')}</span>
                      <Badge className="text-xs bg-green-100 text-green-800 border-green-200">{t('problem_status_completed')}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('problem_stage_kyc')}</span>
                      <Badge variant="destructive" className="text-xs">{t('problem_status_blocked')}</Badge>
                    </div>
                    <div className="rounded bg-red-50 p-2 text-xs">
                      <p className="font-medium text-red-900">{t('problem_ai_note')}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-sm text-green-800">
                    {[t('problem_after_li1'), t('problem_after_li2'), t('problem_after_li3'), t('problem_after_li4')].map((li) => (
                      <li key={li} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-green-500" />{li}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Citizen Empowerment Tools ─────────────────── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="fade-in-section text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">{t('tools_title')}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{t('tools_subtitle')}</p>
              <div className="section-divider mt-5 max-w-xs mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {TOOLS.map((tool) => (
                <Link key={tool.title} href={tool.href}>
                  <div className={`gov-card h-full rounded-xl border ${tool.borderColor} bg-white p-5 cursor-pointer group`}>
                    <div className={`w-10 h-10 rounded-lg ${tool.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5 text-[#1a237e] flex items-center gap-1">
                      {tool.title}
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── India Stack Integration ───────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="fade-in-section text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">{t('indiastack_title')}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{t('indiastack_subtitle')}</p>
              <div className="section-divider mt-5 max-w-xs mx-auto" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 stagger-children">
              {[
                { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50', title: t('indiastack_whatsapp_title'), desc: t('indiastack_whatsapp_desc'), mock: true },
                { icon: Mic, color: 'text-epfo-indigo', bg: 'bg-indigo-50', title: t('indiastack_bhashini_title'), desc: t('indiastack_bhashini_desc'), mock: true },
                { icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50', title: t('indiastack_digilocker_title'), desc: t('indiastack_digilocker_desc'), mock: true },
              ].map((item) => (
                <div key={item.title} className="gov-card bg-white rounded-xl p-5 border border-gray-200 text-center">
                  <div className={`w-11 h-11 rounded-full ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-[#1a237e]">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                  {item.mock && (
                    <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-300 bg-amber-50">
                      {t('mock_preview_badge')}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="relative overflow-hidden py-14">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e] to-[#283593]" />
        <div className="relative container mx-auto px-4">
          <div className="fade-in-section max-w-2xl mx-auto text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('cta2_title')}</h2>
            <p className="text-white/75 mb-7 text-sm">{t('cta2_subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/claim/check">
                <Button size="lg" className="px-8 py-5 gap-2 bg-white text-[#1a237e] hover:bg-gray-100 font-semibold btn-press shadow-lg">
                  <Search className="w-5 h-5" />
                  {t('cta2_check_status')}
                </Button>
              </Link>
              <Link href="/tools/kyc-check">
                <Button size="lg" variant="outline" className="px-8 py-5 gap-2 bg-transparent border-2 border-white/70 text-white hover:bg-white/10 hover:text-white btn-press">
                  <ShieldCheck className="w-5 h-5" />
                  {t('cta2_check_kyc')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="bg-[#1a237e] text-white">
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

      {/* ── Scroll-to-top ────────────────────────────── */}
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
