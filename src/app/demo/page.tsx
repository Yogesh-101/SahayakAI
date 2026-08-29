'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, ArrowLeft, Compass, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';

const DEMO_STEPS = [
  {
    id: 1,
    title: 'The Problem: Opaque EPFO Portal',
    description:
      'Citizens file EPFO claims and see only "Under Process" — no transparency, no guidance, leading to frustration and repeated helpline calls.',
    action: 'View Comparison',
    component: 'comparison',
  },
  {
    id: 2,
    title: 'Try SahayakAI: Check Claim Status',
    description:
      'Enter a UAN to see real-time claim tracking with granular stage-by-stage visibility. Try mock voice input in Hindi or English.',
    action: 'Check Demo Claims',
    link: '/claim/check',
    demoUANs: [
      { uan: '123456789', label: 'Employer Block' },
      { uan: '987654321', label: 'KYC Mismatch' },
      { uan: '555555555', label: 'Processing' },
      { uan: '111111111', label: 'Settled' },
    ],
  },
  {
    id: 3,
    title: 'AI-Powered Bottleneck Diagnosis',
    description:
      'When a claim is delayed, our AI (GPT-3.5-Turbo) analyzes the status and provides a plain-language diagnosis with confidence scoring.',
    action: 'View Diagnosis',
    link: '/claim/123456789/diagnosis',
  },
  {
    id: 4,
    title: 'Actionable Resolution Guidance',
    description:
      'Citizens receive step-by-step instructions to resolve blockers themselves — contact employer, fix KYC, update bank details, or escalate to EPFO.',
    action: 'View Resolution Steps',
    link: '/claim/987654321/diagnosis',
  },
  {
    id: 5,
    title: 'WhatsApp Notifications (Mock Preview)',
    description:
      'Preview how WhatsApp alerts would look at each stage change, blocker detection, and settlement — not sent to a real phone.',
    action: 'View Notifications',
    link: '/claim/111111111/alerts',
  },
  {
    id: 6,
    title: 'Multilingual Support (Hindi + English)',
    description:
      'Hindi UI translations and mock BHASHINI voice input. Additional languages planned for production.',
    action: 'Toggle Language',
    note: 'Use the language toggle in the header to switch to Hindi',
  },
  {
    id: 7,
    title: 'Citizen Empowerment Tools',
    description:
      'Peer comparison, financial impact calculator, smart employer email, and know-your-rights panel — all on the claim dashboard for blocked claims.',
    action: 'View Empowerment Tools',
    link: '/claim/123456789/analytics',
  },
  {
    id: 8,
    title: 'Pre-Filing KYC Health Checker',
    description:
      'Cross-check Name, DOB, PAN, and Aadhaar before filing. Traffic-light scoring catches mismatches early.',
    action: 'Check KYC Health',
    link: '/tools/kyc-check',
  },
  {
    id: 9,
    title: 'One-Click Legal Escalation',
    description:
      'Auto-generate EPFiGMS grievances, RTI applications, and CPGRAMS complaints with proper legal references — ready to copy and submit.',
    action: 'Generate Legal Documents',
    link: '/tools/escalate',
  },
];

export default function DemoPage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [guidedMode, setGuidedMode] = useState(true);
  const step = DEMO_STEPS[currentStep];

  useEffect(() => {
    if (!guidedMode || currentStep >= DEMO_STEPS.length - 1) return;
    const timer = window.setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, DEMO_STEPS.length - 1));
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [guidedMode, currentStep]);

  return (
    <GovPageShell breadcrumbs={[{ label: t('footer_interactive_demo') }]}>
      <div className="container mx-auto px-4 py-8 pb-16">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <p className="text-sm font-medium text-[#1a237e]">
              Step {currentStep + 1} of {DEMO_STEPS.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={guidedMode ? 'default' : 'outline'}
                className={`text-xs h-7 gap-1.5 ${guidedMode ? 'bg-epfo-indigo hover:bg-epfo-navy text-white' : ''}`}
                onClick={() => setGuidedMode(true)}
              >
                <Compass className="w-3.5 h-3.5" />
                Guided Tour
              </Button>
              <Button
                type="button"
                size="sm"
                variant={!guidedMode ? 'default' : 'outline'}
                className={`text-xs h-7 gap-1.5 ${!guidedMode ? 'bg-epfo-indigo hover:bg-epfo-navy text-white' : ''}`}
                onClick={() => setGuidedMode(false)}
              >
                <Map className="w-3.5 h-3.5" />
                Explore
              </Button>
            </div>
          </div>
          {guidedMode && (
            <p className="text-xs text-muted-foreground mb-2">
              Guided mode auto-advances every 12 seconds. Click any step below to jump ahead.
            </p>
          )}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / DEMO_STEPS.length) * 100)}% complete
            </p>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-epfo-indigo transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto space-y-5">
          <Card className="gov-card border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl sm:text-3xl text-[#1a237e]">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {step.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0 border-epfo-indigo/30 text-epfo-indigo">
                  {currentStep + 1}/{DEMO_STEPS.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {step.component === 'comparison' && <BeforeAfterComparison />}

              {step.demoUANs && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[#1a237e]">
                    Try these demo UANs to see different scenarios:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {step.demoUANs.map((demo) => (
                      <Link key={demo.uan} href={`/claim/${demo.uan}/timeline`}>
                        <Card className="cursor-pointer hover:border-epfo-indigo hover:shadow-sm transition-all gov-card">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-mono font-medium text-[#1a237e]">{demo.uan}</p>
                                <p className="text-xs text-muted-foreground mt-1">{demo.label}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {step.note && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <p className="text-sm text-blue-800">{step.note}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="gap-2 btn-press"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {step.link ? (
                  <Link href={step.link}>
                    <Button className="bg-epfo-indigo hover:bg-epfo-navy text-white btn-press gap-2">
                      <Play className="w-4 h-4" />
                      {step.action}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => setCurrentStep(Math.min(DEMO_STEPS.length - 1, currentStep + 1))}
                    disabled={currentStep === DEMO_STEPS.length - 1}
                    className="bg-epfo-indigo hover:bg-epfo-navy text-white btn-press gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <Card className="border-gray-200 bg-gray-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#1a237e]">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {DEMO_STEPS.map((s, idx) => (
                  <Button
                    key={s.id}
                    variant={idx === currentStep ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentStep(idx)}
                    className={`text-xs btn-press ${idx === currentStep ? 'bg-epfo-indigo hover:bg-epfo-navy text-white' : ''}`}
                  >
                    {idx + 1}. {s.title.split(':')[0]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Judge's Note */}
          <div className="rounded-xl border-2 border-epfo-indigo/30 bg-indigo-50/50 p-6">
            <p className="text-sm font-bold text-[#1a237e] mb-3">
              For Judges: What Makes This Special
            </p>
            <ul className="text-sm text-[#1a237e]/80 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-epfo-indigo text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong>Real Problem:</strong> 8 crore+ EPFO members frustrated by opaque status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-epfo-indigo text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong>Technical Depth:</strong> AI diagnosis, 6 empowerment tools, mock India Stack previews (WhatsApp, BHASHINI), Next.js 16</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-epfo-indigo text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong>Instant Impact:</strong> Citizens self-serve with stage visibility and actionable guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-epfo-indigo text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span><strong>Scalable:</strong> Pattern applies to all government services (PAN, Passport, Aadhaar)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-epfo-indigo text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
                <span><strong>Production-Ready:</strong> Mock adapters ready for real API integration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </GovPageShell>
  );
}
