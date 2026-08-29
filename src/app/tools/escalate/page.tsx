'use client';

import { useState, useEffect } from 'react';
import { Scale, Copy, ExternalLink, FileText, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import GovPageShell from '@/components/GovPageShell';
import ToolPageHeader from '@/components/ui/ToolPageHeader';
import GovInput from '@/components/ui/GovInput';
import DemoUanList from '@/components/ui/DemoUanList';
import PageLoading from '@/components/ui/PageLoading';
import { useLanguage } from '@/contexts/LanguageContext';
import { getClaimByUAN } from '@/lib/mock-data/claims';
import {
  generateEPFiGMSComplaint,
  generateRTIApplication,
  generateCPGRAMSComplaint,
  type LegalDocument,
} from '@/lib/services/legal-document-generator';
import type { ClaimStatus } from '@/types/claim';
import { cn } from '@/lib/utils';
import {
  DEMO_UAN_EMPLOYER,
  DEMO_UAN_KYC,
  DEMO_UAN_LENGTH,
  formatDemoUanList,
  isValidUan,
} from '@/lib/claim-session';

export default function EscalatePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uan, setUan] = useState('');
  const [claim, setClaim] = useState<ClaimStatus | null>(null);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uanParam = new URLSearchParams(window.location.search).get('uan');
    if (uanParam && isValidUan(uanParam)) {
      setUan(uanParam);
    }
  }, []);

  const handleGenerate = async () => {
    const trimmed = uan.trim();
    if (!trimmed) return;

    if (!isValidUan(trimmed)) {
      toast({
        title: t('error_claim_not_found'),
        description: t('check_uan_invalid'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const found = getClaimByUAN(trimmed);
    if (!found) {
      toast({ title: t('error_claim_not_found'), description: `${t('error_sample_uans')}: ${formatDemoUanList(2)}`, variant: 'destructive' });
      setLoading(false);
      return;
    }

    setClaim(found);
    const docs = [
      generateEPFiGMSComplaint(found),
      generateRTIApplication(found),
      generateCPGRAMSComplaint(found),
    ];
    setDocuments(docs);
    setActiveDoc(docs[0]);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    toast({ title: t('escalate_doc_copied'), description: activeDoc.portalName });
  };

  return (
    <GovPageShell breadcrumbs={[{ label: t('nav_escalate') }]}>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <ToolPageHeader
          icon={Scale}
          title={t('tool_legal_title')}
          description={t('tool_legal_desc')}
          accent="red"
        />

        {!claim && (
          <Card className="gov-card-elevated mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-[#1a237e]">{t('uan_label')}</CardTitle>
              <CardDescription>{t('escalate_prefill_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <GovInput
                  type="text"
                  inputMode="numeric"
                  maxLength={DEMO_UAN_LENGTH}
                  value={uan}
                  onChange={(e) => setUan(e.target.value.replace(/\D/g, '').slice(0, DEMO_UAN_LENGTH))}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={t('uan_placeholder')}
                  icon={Search}
                  error={uan.length > 0 && !isValidUan(uan)}
                  disabled={loading}
                />
                <Button
                  variant="gov"
                  onClick={handleGenerate}
                  disabled={loading || !isValidUan(uan)}
                  className="shrink-0 px-6"
                >
                  <Scale className="w-4 h-4" />
                  {loading ? t('escalate_generating') : t('escalate_generate')}
                </Button>
              </div>
              {uan.length > 0 && !isValidUan(uan) && (
                <p className="text-xs text-amber-700" role="status">
                  {t('check_uan_invalid')}
                </p>
              )}
              <DemoUanList
                title={t('demo_uans')}
                variant="indigo"
                disabled={loading}
                items={[
                  { uan: DEMO_UAN_EMPLOYER, label: t('escalate_scenario_employer'), onClick: () => setUan(DEMO_UAN_EMPLOYER) },
                  { uan: DEMO_UAN_KYC, label: t('escalate_scenario_kyc'), onClick: () => setUan(DEMO_UAN_KYC) },
                ]}
              />
            </CardContent>
          </Card>
        )}

        {loading && <PageLoading message={t('escalate_generating')} />}

        {claim && documents.length > 0 && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-amber-900">{t('escalate_when_title')}</p>
                <p className="text-amber-700 mt-0.5">
                  {t('escalate_when_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {documents.map(doc => (
                <button
                  key={doc.type}
                  type="button"
                  onClick={() => setActiveDoc(doc)}
                  className={cn(
                    'tab-pill',
                    activeDoc?.type === doc.type ? 'tab-pill-active' : 'tab-pill-inactive',
                  )}
                >
                  {doc.title}
                </button>
              ))}
            </div>

            {activeDoc && (
              <Card className="gov-card-elevated">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg text-[#1a237e] flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-epfo-indigo/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-epfo-indigo" />
                      </span>
                      {activeDoc.title}
                    </CardTitle>
                    {activeDoc.fee && (
                      <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">Fee: {activeDoc.fee}</Badge>
                    )}
                  </div>
                  <CardDescription>
                    Submit this at: {activeDoc.portalName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                      {activeDoc.content}
                    </pre>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="gov" onClick={handleCopy} className="gap-2">
                      <Copy className="w-4 h-4" />
                      {t('escalate_copy_doc')}
                    </Button>
                    <a href={activeDoc.portalUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <ExternalLink className="w-4 h-4" />
                        Open {activeDoc.type === 'epfigms' ? 'EPFiGMS' : activeDoc.type === 'rti' ? 'RTI Portal' : 'CPGRAMS'}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => { setClaim(null); setDocuments([]); setActiveDoc(null); }}>
                <Search className="w-4 h-4" />
                {t('check_another_claim')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </GovPageShell>
  );
}
