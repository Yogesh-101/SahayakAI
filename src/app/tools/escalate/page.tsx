'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, Copy, ExternalLink, FileText, Loader2, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import GovPageShell from '@/components/GovPageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import { getClaimByUAN } from '@/lib/mock-data/claims';
import {
  generateEPFiGMSComplaint,
  generateRTIApplication,
  generateCPGRAMSComplaint,
  type LegalDocument,
} from '@/lib/services/legal-document-generator';
import type { ClaimStatus } from '@/types/claim';

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
    if (uanParam && /^\d{9}$/.test(uanParam)) {
      setUan(uanParam);
    }
  }, []);

  const handleGenerate = async () => {
    if (!uan.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const found = getClaimByUAN(uan);
    if (!found) {
      toast({ title: 'UAN not found', description: 'Try demo UANs: 123456789, 987654321', variant: 'destructive' });
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
    toast({ title: 'Document copied!', description: `Paste this in the ${activeDoc.portalName} form.` });
  };

  return (
    <GovPageShell breadcrumbs={[{ label: t('nav_escalate') }]}>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a237e] mb-2">{t('tool_legal_title')}</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t('tool_legal_desc')}
          </p>
        </div>

        {/* Input */}
        {!claim && (
          <Card className="gov-card border-gray-200 mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-[#1a237e]">{t('uan_label')}</CardTitle>
              <CardDescription>We will generate all escalation documents pre-filled with your claim data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={uan}
                  onChange={(e) => setUan(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder={t('uan_placeholder')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-epfo-indigo/50 focus:border-epfo-indigo transition-colors"
                />
                <Button onClick={handleGenerate} disabled={loading} className="gap-2 bg-epfo-indigo hover:bg-epfo-navy text-white btn-press px-6">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
                  Generate
                </Button>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-xs text-muted-foreground">{t('demo_uans')}</span>
                {['123456789', '987654321'].map(d => (
                  <button key={d} onClick={() => setUan(d)} className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg hover:border-epfo-indigo transition-all font-mono">
                    {d}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-epfo-indigo mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Generating legal documents...</p>
          </div>
        )}

        {/* Documents Generated */}
        {claim && documents.length > 0 && (
          <div className="space-y-5">
            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">When to escalate</p>
                <p className="text-amber-700">
                  EPFO recommends waiting at least 10 days before filing a grievance. Your claim has been pending for this period, so escalation is appropriate.
                </p>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {documents.map(doc => (
                <button
                  key={doc.type}
                  onClick={() => setActiveDoc(doc)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all btn-press ${
                    activeDoc?.type === doc.type
                      ? 'bg-epfo-indigo text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-epfo-indigo/50'
                  }`}
                >
                  {doc.title}
                </button>
              ))}
            </div>

            {/* Active Document */}
            {activeDoc && (
              <Card className="gov-card border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[#1a237e] flex items-center gap-2">
                      <FileText className="w-4 h-4" />
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
                  <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                      {activeDoc.content}
                    </pre>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleCopy} className="gap-2 bg-epfo-indigo hover:bg-epfo-navy text-white btn-press">
                      <Copy className="w-4 h-4" />
                      Copy Document
                    </Button>
                    <a href={activeDoc.portalUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2 btn-press">
                        <ExternalLink className="w-4 h-4" />
                        Open {activeDoc.type === 'epfigms' ? 'EPFiGMS' : activeDoc.type === 'rti' ? 'RTI Portal' : 'CPGRAMS'}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => { setClaim(null); setDocuments([]); setActiveDoc(null); }} className="btn-press">
                <Search className="w-4 h-4 mr-2" />
                Check Another Claim
              </Button>
            </div>
          </div>
        )}
      </div>
    </GovPageShell>
  );
}
