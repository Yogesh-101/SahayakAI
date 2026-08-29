'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Phone,
  ExternalLink,
  AlertCircle,
  Brain,
  RefreshCw,
  Copy,
  Check,
  Scale,
  Mic,
  Square,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import WhatIfToday from '@/components/claim/WhatIfToday';
import type { ClaimStatus } from '@/types/claim';
import type { Diagnosis } from '@/types/diagnosis';
import { getResolutionGuide } from '@/lib/services/resolution-guides';
import { isClaimBlocked } from '@/lib/claim-navigation';

interface DiagnosisPanelProps {
  claim: ClaimStatus;
}

export default function DiagnosisPanel({ claim }: DiagnosisPanelProps) {
  const { t } = useLanguage();
  const blocked = isClaimBlocked(claim);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [aiSource, setAiSource] = useState<'openai' | 'rules'>('rules');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResolution, setShowResolution] = useState(blocked);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [reading, setReading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(`checklist_${claim.uan}`);
    if (saved) {
      try {
        setCheckedSteps(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, [claim.uan]);

  const toggleCheck = (idx: number) => {
    setCheckedSteps((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      localStorage.setItem(`checklist_${claim.uan}`, JSON.stringify(next));
      return next;
    });
  };

  const runDiagnosis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/claim/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setDiagnosis(data.diagnosis);
      setAiSource(data.source || 'rules');
      if (blocked) setShowResolution(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error_diagnosis_failed'));
    } finally {
      setLoading(false);
    }
  }, [claim, blocked, t]);

  useEffect(() => {
    runDiagnosis();
  }, [runDiagnosis]);

  const copyToClipboard = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(idx);
      toast({ title: t('copied_title'), description: t('copied_status') });
      setTimeout(() => setCopiedStep(null), 2000);
    } catch {
      toast({ title: t('error_try_again'), variant: 'destructive' });
    }
  };

  const readAloud = () => {
    if (!diagnosis || typeof window === 'undefined' || !window.speechSynthesis) return;
    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      return;
    }
    const text = [diagnosis.problem, diagnosis.evidence].filter(Boolean).join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setReading(false);
    setReading(true);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <Card className="border-primary-200">
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-3 py-10">
          <Brain className="w-10 h-10 text-primary animate-pulse" />
          <Spinner className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">{t('running_diagnosis')}</span>
          <span className="text-xs text-muted-foreground">{t('diagnosis_analyzing')}</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !diagnosis) {
    return (
      <Card className="border-warning-200 bg-warning-50">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
            <div className="text-sm text-warning-800 flex-1">
              <p className="font-medium">{t('error_diagnosis_failed')}</p>
              <p className="text-warning-700 mt-1">{error || t('error_try_again')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={runDiagnosis} className="gap-2 min-h-[44px]">
            <RefreshCw className="w-4 h-4" />
            {t('diagnosis_retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const guide = getResolutionGuide(diagnosis.resolution);
  const daysInStage = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(claim.stages[claim.currentStage].enteredAt).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const showEscalate = blocked || daysInStage >= 7;
  const steps =
    diagnosis.resolutionSteps && diagnosis.resolutionSteps.length > 0
      ? diagnosis.resolutionSteps.map((s, i) => ({
          title: `Step ${i + 1}`,
          description: s,
          links: [] as Array<{ label: string; url: string }>,
        }))
      : guide.steps;

  return (
    <div className="space-y-4">
      <WhatIfToday claim={claim} />

      <Card className={blocked ? 'border-danger-200 bg-danger-50' : 'border-primary-200 bg-primary-50'}>
        <CardHeader>
          <div className="flex items-start gap-3">
            <Lightbulb className={`w-6 h-6 shrink-0 ${blocked ? 'text-danger-600' : 'text-primary-600'}`} />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                {blocked ? t('issue_detected') : t('diagnosis_title')}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg">{diagnosis.problem}</CardTitle>
                <Badge
                  variant="outline"
                  className={`text-[10px] h-5 ${
                    aiSource === 'openai'
                      ? 'border-green-300 bg-green-50 text-green-800'
                      : 'border-amber-300 bg-amber-50 text-amber-800'
                  }`}
                >
                  {aiSource === 'openai' ? t('diagnosis_gpt_powered') : t('diagnosis_rule_based')}
                </Badge>
              </div>
              <CardDescription className={blocked ? 'text-danger-700' : 'text-primary-700'}>
                {t('confidence')} {Math.round(diagnosis.confidence * 100)}%
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {diagnosis.evidence && (
            <p className={`text-sm ${blocked ? 'text-danger-700' : 'text-primary-700'}`}>
              {diagnosis.evidence}
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowResolution(!showResolution)}
              variant={blocked ? 'destructive' : 'default'}
              className="min-h-[44px]"
            >
              {showResolution ? t('hide_resolution') : t('show_resolution')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={readAloud}
              className="gap-2 min-h-[44px]"
            >
              {reading ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {t('diagnosis_read_aloud')}
            </Button>
            {showEscalate && (
              <Link href={`/tools/escalate?uan=${claim.uan}`}>
                <Button variant="outline" className="gap-2 min-h-[44px] border-red-200 text-red-800 hover:bg-red-50">
                  <Scale className="w-4 h-4" />
                  {t('diagnosis_escalate_cta')}
                </Button>
              </Link>
            )}
            <Button variant="outline" size="icon" onClick={runDiagnosis} className="min-h-[44px] min-w-[44px]" aria-label={t('diagnosis_retry')}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResolution && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{guide.title}</CardTitle>
            <CardDescription>{guide.description}</CardDescription>
            <Badge variant="outline" className="text-xs w-fit mt-2">
              {guide.estimatedTime}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-sm font-semibold text-[#1a237e]">{t('diagnosis_checklist_title')}</p>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="rounded-lg border p-3 bg-gray-50/50">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checkedSteps[idx]}
                      onChange={() => toggleCheck(idx)}
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => copyToClipboard(step.description, idx)}
                        >
                          {copiedStep === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {t('diagnosis_step_copy')}
                        </Button>
                        {guide.helplineNumbers[0] && (
                          <a href="tel:14470">
                            <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-xs">
                              <Phone className="w-3 h-3" />
                              {t('diagnosis_step_call')}
                            </Button>
                          </a>
                        )}
                        {step.links?.map((link, linkIdx) => (
                          <a key={linkIdx} href={link.url} target="_blank" rel="noopener noreferrer">
                            <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-xs">
                              <ExternalLink className="w-3 h-3" />
                              {link.label || t('diagnosis_step_open')}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {guide.helplineNumbers.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('diagnosis_helpline')}
                </p>
                <div className="space-y-1">
                  {guide.helplineNumbers.map((number, idx) => (
                    <a key={idx} href="tel:14470" className="block text-sm text-epfo-indigo hover:underline">
                      {number}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
