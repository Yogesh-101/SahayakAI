'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
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
import VoiceInput from '@/components/VoiceInput';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchClaimStatus } from '@/lib/adapters/epfo-adapter';

export default function ClaimCheckPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [uan, setUan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await fetchClaimStatus(uan);
      toast({ title: 'Claim found!', description: `Navigating to claim ${uan}...` });
      router.push(`/claim/${uan}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back_to_home')}
        </Link>
        <LanguageToggle />
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl">
                {t('check_title')}
              </CardTitle>
              <CardDescription>
                {t('check_subtitle')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="uan"
                    className="block text-sm font-medium mb-1"
                  >
                    {t('uan_label')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="uan"
                      type="text"
                      inputMode="numeric"
                      value={uan}
                      onChange={(e) => setUan(e.target.value)}
                      placeholder={t('uan_placeholder')}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      disabled={loading}
                      required
                      autoComplete="off"
                    />
                    <VoiceInput onTranscript={(text) => setUan(text)} />
                  </div>
                </div>

                {error && (
                  <div
                    className="rounded-md bg-danger-50 border border-danger-200 p-3 text-sm text-danger-700"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading || !uan.trim()}
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      {t('checking')}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('check_button')}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 rounded-md bg-primary-50 border border-primary-200 p-4">
                <p className="text-xs font-medium text-primary-700 mb-2">
                  {t('demo_uans')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { uan: '123456789', label: 'Employer block' },
                    { uan: '987654321', label: 'KYC mismatch' },
                    { uan: '555555555', label: 'Processing' },
                    { uan: '111111111', label: 'Settled' },
                  ].map((demo) => (
                    <button
                      key={demo.uan}
                      type="button"
                      onClick={() => setUan(demo.uan)}
                      className="text-xs"
                    >
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary-100 transition-colors"
                      >
                        {demo.uan}{' '}
                        <span className="text-muted-foreground ml-1">
                          ({demo.label})
                        </span>
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {t('disclaimer')}
          </p>
        </div>
      </main>
    </div>
  );
}
