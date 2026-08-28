'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Lightbulb,
  Phone,
  ExternalLink,
  AlertCircle,
  Brain,
  RefreshCw,
  Copy,
  Check,
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
import type { ClaimStatus } from '@/types/claim';
import type { Diagnosis } from '@/types/diagnosis';
import { getResolutionGuide } from '@/lib/services/resolution-guides';

interface DiagnosisPanelProps {
  claim: ClaimStatus;
}

export default function DiagnosisPanel({ claim }: DiagnosisPanelProps) {
  const { t } = useLanguage();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [aiSource, setAiSource] = useState<'openai' | 'rules'>('rules');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResolution, setShowResolution] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const { toast } = useToast();

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Diagnosis failed');
    } finally {
      setLoading(false);
    }
  }, [claim]);

  useEffect(() => {
    runDiagnosis();
  }, [runDiagnosis]);

  const copyToClipboard = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(idx);
      toast({ title: 'Copied!', description: 'Step copied to clipboard.' });
      setTimeout(() => setCopiedStep(null), 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy manually.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-primary-200">
        <CardContent className="pt-6 flex flex-col items-center justify-center gap-3 py-10">
          <div className="relative">
            <Brain className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <Spinner className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            Running AI diagnosis on your claim...
          </span>
          <span className="text-xs text-muted-foreground">
            Analyzing claim stages, timelines, and blockers
          </span>
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
              <p className="font-medium">Could not run diagnosis</p>
              <p className="text-warning-700 mt-1">
                {error || 'Please try again later'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runDiagnosis}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Diagnosis
          </Button>
        </CardContent>
      </Card>
    );
  }

  const guide = getResolutionGuide(diagnosis.resolution);
  const isBlocked = claim.stages[claim.currentStage].status === 'blocked';

  return (
    <div className="space-y-4">
      <Card
        className={
          isBlocked
            ? 'border-danger-200 bg-danger-50'
            : 'border-primary-200 bg-primary-50'
        }
      >
        <CardHeader>
          <div className="flex items-start gap-3">
            <Lightbulb
              className={`w-6 h-6 shrink-0 ${isBlocked ? 'text-danger-600' : 'text-primary-600'}`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg">
                  {isBlocked ? 'Issue Detected' : 'AI Diagnosis'}
                </CardTitle>
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
              <CardDescription
                className={isBlocked ? 'text-danger-700' : 'text-primary-700'}
              >
                Confidence: {Math.round(diagnosis.confidence * 100)}%
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p
            className={`font-medium ${isBlocked ? 'text-danger-900' : 'text-primary-900'}`}
          >
            {diagnosis.problem}
          </p>

          {diagnosis.evidence && (
            <p
              className={`text-sm ${isBlocked ? 'text-danger-700' : 'text-primary-700'}`}
            >
              {diagnosis.evidence}
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowResolution(!showResolution)}
              variant={isBlocked ? 'destructive' : 'default'}
              className="sm:w-auto"
            >
              {showResolution ? 'Hide' : 'Show'} Resolution Steps
            </Button>
            <Button variant="outline" size="icon" onClick={runDiagnosis} aria-label="Re-run diagnosis">
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
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Estimated: {guide.estimatedTime}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              {diagnosis.resolutionSteps && diagnosis.resolutionSteps.length > 0
                ? diagnosis.resolutionSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 group"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm pt-0.5 flex-1">{step}</p>
                      <button
                        onClick={() => copyToClipboard(step, idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                        aria-label={`Copy step ${idx + 1}`}
                      >
                        {copiedStep === idx ? (
                          <Check className="w-3.5 h-3.5 text-secondary" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  ))
                : guide.steps.map((step, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{step.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                          {step.links && step.links.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {step.links.map((link, linkIdx) => (
                                <a
                                  key={linkIdx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {guide.helplineNumbers.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  EPFO Helpline Numbers
                </p>
                <div className="space-y-1">
                  {guide.helplineNumbers.map((number, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {number}
                    </p>
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
