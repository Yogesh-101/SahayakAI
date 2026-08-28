'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function BeforeAfterComparison() {
  const [view, setView] = useState<'side-by-side' | 'toggle'>('side-by-side');
  const [toggleView, setToggleView] = useState<'before' | 'after'>('before');

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">The Problem We Solve</h2>
          <p className="text-muted-foreground text-sm mt-1">
            EPFO Portal vs. SahayakAI
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setView(view === 'side-by-side' ? 'toggle' : 'side-by-side')
          }
        >
          {view === 'side-by-side' ? 'Toggle View' : 'Side by Side'}
        </Button>
      </div>

      {/* Side-by-Side View */}
      {view === 'side-by-side' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* BEFORE: EPFO Portal */}
          <Card className="border-danger-200 bg-danger-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-danger-900">
                  ❌ EPFO Portal (Current)
                </CardTitle>
                <Badge variant="destructive">Opaque</Badge>
              </div>
              <CardDescription className="text-danger-700">
                Citizens are left in the dark
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-white p-4 border border-danger-200">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Claim Status:
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">UNDER PROCESS</span>
                  <span className="text-warning-600 text-sm">⏳ 18 days</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last Updated: 15 days ago
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger-600 shrink-0 mt-0.5" />
                  <p className="text-danger-800">
                    No visibility into which stage is causing delay
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger-600 shrink-0 mt-0.5" />
                  <p className="text-danger-800">
                    No diagnosis of what went wrong
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger-600 shrink-0 mt-0.5" />
                  <p className="text-danger-800">
                    No actionable steps to resolve issues
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger-600 shrink-0 mt-0.5" />
                  <p className="text-danger-800">
                    Citizens must repeatedly check portal
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-danger-100 border border-danger-200 p-3">
                <p className="text-xs text-danger-800">
                  <strong>Result:</strong> Citizens call helplines repeatedly,
                  file grievances, and wait indefinitely without knowing why or
                  what to do.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AFTER: SahayakAI */}
          <Card className="border-secondary-200 bg-secondary-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-secondary-900">
                  ✅ SahayakAI (Solution)
                </CardTitle>
                <Badge variant="secondary">Transparent</Badge>
              </div>
              <CardDescription className="text-secondary-700">
                Complete clarity and actionable guidance
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-white p-4 border border-secondary-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stage 1:</span>
                  <Badge variant="secondary" className="text-xs">
                    ✓ Completed
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stage 2:</span>
                  <Badge variant="destructive" className="text-xs">
                    🚨 Blocked
                  </Badge>
                </div>
                <div className="rounded-md bg-danger-50 border border-danger-200 p-2 text-xs">
                  <p className="font-medium text-danger-900">
                    Issue: Employer has not approved your claim
                  </p>
                  <p className="text-danger-700 mt-1">
                    Blocked for 15 days • AI Confidence: 92%
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary-600 shrink-0 mt-0.5" />
                  <p className="text-secondary-800">
                    Real-time status at every stage
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary-600 shrink-0 mt-0.5" />
                  <p className="text-secondary-800">
                    AI-powered bottleneck diagnosis
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary-600 shrink-0 mt-0.5" />
                  <p className="text-secondary-800">
                    Step-by-step resolution guidance
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary-600 shrink-0 mt-0.5" />
                  <p className="text-secondary-800">
                    WhatsApp notifications at each stage
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-secondary-100 border border-secondary-200 p-3">
                <p className="text-xs text-secondary-800">
                  <strong>Result:</strong> Citizens know exactly what's wrong,
                  why it's delayed, and how to fix it—without helpline calls or
                  guessing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toggle View */}
      {view === 'toggle' && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={toggleView === 'before' ? 'default' : 'outline'}
              onClick={() => setToggleView('before')}
            >
              Before (EPFO)
            </Button>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <Button
              variant={toggleView === 'after' ? 'default' : 'outline'}
              onClick={() => setToggleView('after')}
            >
              After (SahayakAI)
            </Button>
          </div>

          {toggleView === 'before' ? (
            <Card className="border-danger-200 bg-danger-50">
              <CardHeader>
                <CardTitle className="text-lg text-danger-900">
                  ❌ EPFO Portal
                </CardTitle>
                <CardDescription className="text-danger-700">
                  Opaque "Under Process" — no clarity or guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-white p-6 border border-danger-200">
                  <p className="text-center text-2xl font-bold mb-2">
                    UNDER PROCESS
                  </p>
                  <p className="text-center text-muted-foreground text-sm">
                    Last Updated: 15 days ago
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-secondary-200 bg-secondary-50">
              <CardHeader>
                <CardTitle className="text-lg text-secondary-900">
                  ✅ SahayakAI
                </CardTitle>
                <CardDescription className="text-secondary-700">
                  Complete transparency with AI-powered guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-white p-6 border border-secondary-200 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-md bg-secondary-50 p-3">
                      <p className="text-xs text-muted-foreground">Stage 1</p>
                      <p className="font-medium text-sm">✓ Completed</p>
                    </div>
                    <div className="rounded-md bg-danger-50 p-3">
                      <p className="text-xs text-muted-foreground">Stage 2</p>
                      <p className="font-medium text-sm">🚨 Blocked</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="font-medium">AI Diagnosis:</p>
                    <p className="text-muted-foreground">
                      Employer hasn't approved • Blocked 15 days
                    </p>
                    <Button size="sm" className="w-full">
                      View Resolution Steps →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Impact Statement */}
      <div className="rounded-lg border-2 border-primary bg-primary-50 p-6 text-center">
        <p className="text-lg font-bold text-primary-900 mb-2">
          💡 Impact: Fewer repeat portal checks and clearer next steps
        </p>
        <p className="text-sm text-primary-800">
          Citizens resolve issues themselves with clear guidance, freeing EPFO
          staff to focus on complex cases.
        </p>
      </div>
    </div>
  );
}
