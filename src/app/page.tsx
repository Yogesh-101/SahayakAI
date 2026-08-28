'use client';

import Link from 'next/link';
import {
  Search,
  Shield,
  MessageCircle,
  Mic,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Brain,
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

const FEATURES = [
  {
    icon: Search,
    titleKey: 'feature_tracking',
    titleFallback: 'Real-Time Tracking',
    description:
      'See exactly which stage your claim is at — Employer Approval, KYC, EPFO Sanction, or Payment.',
    color: 'text-primary',
    bgColor: 'bg-primary-50',
  },
  {
    icon: Brain,
    titleKey: 'feature_diagnosis',
    titleFallback: 'AI Diagnosis',
    description:
      'GPT-powered bottleneck detection identifies why your claim is delayed with confidence scoring.',
    color: 'text-secondary',
    bgColor: 'bg-secondary-50',
  },
  {
    icon: Shield,
    titleKey: 'feature_resolution',
    titleFallback: 'Resolution Guidance',
    description:
      'Step-by-step instructions to fix blockers — contact HR, update KYC, or escalate to EPFO.',
    color: 'text-primary',
    bgColor: 'bg-primary-50',
  },
  {
    icon: MessageCircle,
    titleKey: 'feature_whatsapp',
    titleFallback: 'WhatsApp Alerts',
    description:
      'Get notified on WhatsApp when your claim moves, gets blocked, or is settled.',
    color: 'text-secondary',
    bgColor: 'bg-secondary-50',
  },
  {
    icon: Mic,
    titleKey: 'feature_voice',
    titleFallback: 'Voice Input',
    description:
      'Speak your UAN in Hindi or English using BHASHINI — works for 22 Indian languages.',
    color: 'text-primary',
    bgColor: 'bg-primary-50',
  },
  {
    icon: Clock,
    titleKey: 'feature_prediction',
    titleFallback: 'Settlement Prediction',
    description:
      'AI predicts your estimated settlement date based on current processing speed.',
    color: 'text-secondary',
    bgColor: 'bg-secondary-50',
  },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-secondary-50">
      {/* ── Header ────────────────────────────────────── */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">{t('app_name')}</div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/claim/check">
              <Button size="sm" className="hidden sm:inline-flex">
                {t('cta_check_status')}
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <main>
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm bg-warning-50 text-warning-800 border-warning-200">
              {t('demo_mode')}: Using mock EPFO data
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              {t('hero_title').split('AI')[0]}
              <span className="text-primary">AI</span>
              {t('hero_title').split('AI').slice(1).join('AI')}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('hero_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/claim/check">
                <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto gap-2">
                  <Search className="w-5 h-5" />
                  {t('cta_check_status')}
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 w-full sm:w-auto gap-2"
                >
                  {t('cta_view_demo')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Before/After ────────────────────────────── */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              The Problem We Solve
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-danger-200 bg-danger-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-danger-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    EPFO Portal (Current)
                  </CardTitle>
                  <CardDescription className="text-danger-700">Citizens left in the dark</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-white p-4 border border-danger-200 mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Status:</p>
                    <p className="font-bold text-xl">UNDER PROCESS</p>
                    <p className="text-xs text-muted-foreground mt-2">Last Updated: 15 days ago</p>
                  </div>
                  <ul className="space-y-2 text-sm text-danger-800">
                    <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> No visibility into which stage is delayed</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> No diagnosis of what went wrong</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> No actionable steps to resolve</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> Must check portal daily</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-secondary-200 bg-secondary-50/50">
                <CardHeader>
                  <CardTitle className="text-lg text-secondary-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    SahayakAI (Solution)
                  </CardTitle>
                  <CardDescription className="text-secondary-700">Complete clarity and guidance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-white p-4 border border-secondary-200 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Employer Approval</span>
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>KYC Verification</span>
                      <Badge variant="destructive" className="text-xs">Blocked</Badge>
                    </div>
                    <div className="rounded bg-danger-50 p-2 text-xs">
                      <p className="font-medium text-danger-900">AI: KYC mismatch detected (92%)</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-secondary-800">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Real-time stage-by-stage visibility</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> AI-powered bottleneck diagnosis</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Step-by-step resolution guide</li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> WhatsApp alerts at every stage</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────── */}
        <section className="container mx-auto px-4 py-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">How SahayakAI Works</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Six integrated features working together to give you complete control over your EPFO claim.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <Card key={feature.titleKey} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.titleFallback}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────── */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">8Cr+</div>
                <div className="text-sm text-muted-foreground">{t('stat_claims_tracked')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-secondary mb-1">20→7</div>
                <div className="text-sm text-muted-foreground">{t('stat_avg_resolution')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">92%</div>
                <div className="text-sm text-muted-foreground">{t('stat_success_rate')}</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-secondary mb-1">22</div>
                <div className="text-sm text-muted-foreground">Languages Supported</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── India Stack ─────────────────────────────── */}
        <section className="container mx-auto px-4 py-16 bg-primary-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Built on India Stack</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
              Native integration with India's digital infrastructure for maximum accessibility.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">WhatsApp Business API</h3>
                  <p className="text-sm text-muted-foreground">Real-time notifications directly to your phone</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Mic className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">BHASHINI</h3>
                  <p className="text-sm text-muted-foreground">Voice input in 22 Indian languages</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Shield className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">DigiLocker</h3>
                  <p className="text-sm text-muted-foreground">Verified KYC documents for instant verification</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to track your claim?
            </h2>
            <p className="text-muted-foreground mb-8">
              Enter your UAN and get instant AI-powered diagnosis. No sign-up required.
            </p>
            <Link href="/claim/check">
              <Button size="lg" className="text-lg px-10 py-6 gap-2">
                <Search className="w-5 h-5" />
                {t('cta_check_status')}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{t('app_name')}</span> — Built for Build What Moves India 2026
            </div>
            <p>{t('disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
