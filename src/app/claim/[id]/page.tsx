'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  IndianRupee,
  Calendar,
  FileText,
  Building2,
  User,
  Clock,
  Share2,
  Search,
  Brain,
  BarChart3,
  Scale,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import ClaimHealthScore from '@/components/ClaimHealthScore';
import ClaimStatusTimeline from '@/components/ClaimStatusTimeline';
import DiagnosisPanel from '@/components/DiagnosisPanel';
import WhatsAppPreview from '@/components/WhatsAppPreview';
import EmailTracker from '@/components/EmailTracker';
import PeerComparison from '@/components/PeerComparison';
import FinancialImpact from '@/components/FinancialImpact';
import RightsPanel from '@/components/RightsPanel';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';
import type { ClaimStatus } from '@/types/claim';

const CLAIM_TYPE_LABELS: Record<string, Record<string, string>> = {
  en: { withdrawal: 'PF Withdrawal', loan: 'PF Loan', pension: 'Pension' },
  hi: { withdrawal: 'PF निकासी', loan: 'PF ऋण', pension: 'पेंशन' },
};

const STAGE_BADGE: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'warning' }
> = {
  completed: { label: 'Settled', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'default' },
  pending: { label: 'Pending', variant: 'default' },
  blocked: { label: 'Blocked', variant: 'destructive' },
};

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 pt-2">
      <div className="w-9 h-9 rounded-lg bg-[#1a237e]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-[#1a237e]" />
      </div>
      <div>
        <h2 className="text-base font-bold text-[#1a237e]">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ClaimDetailPage() {
  const params = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [claim, setClaim] = useState<ClaimStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchClaimStatus(params.id);
        if (!cancelled) setClaim(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load claim');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params.id]);

  useEffect(() => {
    const validTabs = ['timeline', 'diagnosis', 'analytics', 'rights', 'notifications', 'peer-comparison', 'financial-impact', 'email-tracker'];
    const hash = window.location.hash.replace('#', '');
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash === 'peer-comparison' || hash === 'financial-impact' ? 'analytics' : hash === 'email-tracker' ? 'diagnosis' : hash);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [params.id, claim?.uan]);

  const shareStatus = async () => {
    const text = claim
      ? `My EPFO claim (UAN: ${claim.uan}) is at ${claim.currentStage} stage. Track yours at SahayakAI.`
      : '';
    if (navigator.share) {
      try { await navigator.share({ title: 'SahayakAI Claim Status', text }); }
      catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied!', description: 'Status copied to clipboard.' });
    }
  };

  if (loading) {
    return (
      <GovPageShell breadcrumbs={[{ label: t('cta_check_status'), href: '/claim/check' }, { label: `UAN: ${params.id}` }]}>
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-3">
            <Spinner className="mx-auto h-8 w-8" />
            <p className="text-muted-foreground text-sm">Fetching claim status...</p>
          </div>
        </div>
      </GovPageShell>
    );
  }

  if (error || !claim) {
    return (
      <GovPageShell breadcrumbs={[{ label: t('cta_check_status'), href: '/claim/check' }, { label: 'Error' }]}>
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-lg mx-auto gov-card">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <p className="font-medium text-lg">{t('error_claim_not_found')}</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Link href="/claim/check">
                <Button className="bg-epfo-indigo hover:bg-epfo-navy text-white btn-press">{t('error_try_another_uan')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </GovPageShell>
    );
  }

  const currentStageStatus = claim.stages[claim.currentStage].status;
  const badge = STAGE_BADGE[currentStageStatus] ?? STAGE_BADGE.pending;
  const allCompleted = Object.values(claim.stages).every((s) => s.status === 'completed');
  const claimTypeLabels = CLAIM_TYPE_LABELS[language] || CLAIM_TYPE_LABELS.en;

  const TABS = [
    { id: 'timeline', label: 'Timeline', icon: Search },
    ...(!allCompleted
      ? [{ id: 'diagnosis', label: 'Diagnosis', icon: Brain }]
      : []),
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ...(!allCompleted
      ? [{ id: 'rights', label: 'Rights', icon: Scale }]
      : []),
    { id: 'notifications', label: 'Alerts', icon: MessageSquare },
  ] as const;

  const scrollToTab = (tabId: string) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
    document.getElementById(tabId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <GovPageShell
      breadcrumbs={[
        { label: t('cta_check_status'), href: '/claim/check' },
        { label: `UAN: ${claim.uan}` },
      ]}
    >
      <div className="container mx-auto px-4 py-6 pb-16 max-w-4xl space-y-6">

        <ClaimHealthScore claim={claim} />

        {/* Tab navigation */}
        <div className="sticky top-[3.5rem] z-40 -mx-4 px-4 py-2 bg-white/95 backdrop-blur border-b border-gray-100">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1a237e] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1: Claim Overview
           ═══════════════════════════════════════════════ */}
        <Card className="gov-card border-gray-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#f8c8dc] via-[#c77dff] to-[#5e72e4]" />
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-[#1a237e]">{claim.memberName}</CardTitle>
                <CardDescription className="font-mono">UAN: {claim.uan}</CardDescription>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Badge variant={badge.variant} className="text-sm px-3 py-1">
                  {allCompleted ? t('status_settled') : badge.label}
                </Badge>
                <Button variant="outline" size="icon" className="h-8 w-8 btn-press" onClick={shareStatus} aria-label="Share status">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {[
                { icon: FileText, bg: 'bg-indigo-50', color: 'text-epfo-indigo', label: t('claim_type'), value: claimTypeLabels[claim.claimType] },
                { icon: IndianRupee, bg: 'bg-green-50', color: 'text-green-600', label: t('amount'), value: `₹${claim.amount.toLocaleString('en-IN')}` },
                { icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-600', label: t('filed_on'), value: format(new Date(claim.filingDate), 'dd MMM yyyy') },
                { icon: Building2, bg: 'bg-purple-50', color: 'text-purple-600', label: t('employer'), value: claim.employerName },
              ].map(({ icon: Ic, bg, color, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Ic className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px]">{label}</p>
                    <p className="font-medium text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {claim.estimatedSettlement && !allCompleted && (
              <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">
                  {t('estimated_settlement')} <strong>{format(new Date(claim.estimatedSettlement), 'dd MMM yyyy')}</strong>
                </span>
              </div>
            )}

            {allCompleted && (
              <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-green-800">₹{claim.amount.toLocaleString('en-IN')} <strong>{t('settled_message')}</strong></span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════
            SECTION 2: Status & Tracking
           ═══════════════════════════════════════════════ */}
        <div id="timeline">
          <SectionHeader icon={Search} title={t('claim_progress')} subtitle={t('claim_progress_subtitle')} />
          <Card className="gov-card border-gray-200">
            <CardContent className="pt-5">
              <ClaimStatusTimeline stages={claim.stages} currentStage={claim.currentStage} />
            </CardContent>
          </Card>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 3: AI Diagnosis & Employer Action
           ═══════════════════════════════════════════════ */}
        {!allCompleted && (
          <div id="diagnosis">
            <SectionHeader icon={Brain} title="AI Diagnosis & Actions" subtitle="AI-powered issue detection and recommended actions" />
            <div className="space-y-4">
              <DiagnosisPanel claim={claim} />
              <div id="email-tracker">
                {claim.currentStage === 'employerApproval' && <EmailTracker claim={claim} />}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SECTION 4: Analytics & Insights
           ═══════════════════════════════════════════════ */}
        <div id="analytics">
          <SectionHeader icon={BarChart3} title="Analytics & Financial Insights" subtitle="Compare your claim and understand the cost of delay" />
          <div className="grid md:grid-cols-2 gap-4">
            <div id="peer-comparison">
              <PeerComparison claim={claim} />
            </div>
            {!allCompleted && (
              <div id="financial-impact">
                <FinancialImpact claim={claim} />
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 5: Legal Rights & Escalation
           ═══════════════════════════════════════════════ */}
        {!allCompleted && (
          <div id="rights">
            <SectionHeader icon={Scale} title="Legal Rights & Escalation" subtitle="Know your rights and take action when needed" />
            <RightsPanel claim={claim} />
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            SECTION 6: Notifications
           ═══════════════════════════════════════════════ */}
        <div id="notifications">
          <SectionHeader icon={MessageSquare} title={t('whatsapp_title')} subtitle={t('whatsapp_subtitle')} />
          <WhatsAppPreview claim={claim} />
        </div>

        {/* ── Navigation ─────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 pt-2 text-sm">
          <Link href="/claim/check">
            <Button variant="outline" className="gap-2 btn-press">
              <Search className="w-4 h-4" />
              {t('check_another_claim')}
            </Button>
          </Link>
        </div>
      </div>
    </GovPageShell>
  );
}
