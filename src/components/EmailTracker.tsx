'use client';

import { useState, useEffect } from 'react';
import { Mail, Copy, Clock, AlertTriangle, CheckCircle2, Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import type { ClaimStatus } from '@/types/claim';
import {
  generateEmployerEmail,
  generateFollowUpEmail,
  getEmailTrackerState,
  markEmailSent,
  markReminderSent,
  type GeneratedEmail,
  type EmailTrackerState,
} from '@/lib/services/email-generator';

interface EmailTrackerProps {
  claim: ClaimStatus;
}

export default function EmailTracker({ claim }: EmailTrackerProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [trackerState, setTrackerState] = useState<EmailTrackerState | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const generated = generateEmployerEmail(claim);
    setEmail(generated);
    setTrackerState(getEmailTrackerState(claim.claimId));
  }, [claim]);

  const handleCopyEmail = () => {
    if (!email) return;
    const fullEmail = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(fullEmail);
    toast({ title: 'Email copied to clipboard', description: 'Paste it in your email client and send.' });
  };

  const handleMarkSent = () => {
    markEmailSent(claim.claimId);
    setTrackerState(getEmailTrackerState(claim.claimId));
    toast({ title: 'Email marked as sent', description: 'We will track the follow-up timeline for you.' });
  };

  const handleSendReminder = () => {
    markReminderSent(claim.claimId);
    const state = getEmailTrackerState(claim.claimId);
    setTrackerState(state);
    const followUp = generateFollowUpEmail(claim, state.daysSinceSent);
    const fullEmail = `Subject: ${followUp.subject}\n\n${followUp.body}`;
    navigator.clipboard.writeText(fullEmail);
    toast({ title: 'Follow-up email copied', description: 'Send this stronger follow-up to your employer.' });
  };

  if (!email || !trackerState) return null;

  const urgencyColors = {
    normal: 'bg-blue-100 text-blue-800 border-blue-200',
    urgent: 'bg-amber-100 text-amber-800 border-amber-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Card className="border-primary-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Smart Email to Employer
          </CardTitle>
          <Badge className={urgencyColors[email.urgencyLevel]}>
            {email.urgencyLevel === 'critical' ? 'CRITICAL' : email.urgencyLevel === 'urgent' ? 'URGENT' : 'Normal'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tracker Status */}
        {trackerState.status !== 'not_sent' && (
          <div className={`rounded-lg p-3 text-sm ${
            trackerState.status === 'escalated' ? 'bg-red-50 border border-red-200' :
            trackerState.status === 'awaiting_response' ? 'bg-amber-50 border border-amber-200' :
            'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              {trackerState.status === 'escalated' && <AlertTriangle className="w-4 h-4 text-red-600" />}
              {trackerState.status === 'awaiting_response' && <Clock className="w-4 h-4 text-amber-600" />}
              {trackerState.status === 'sent' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              <span>
                {trackerState.status === 'sent' && 'Email sent - tracking response'}
                {trackerState.status === 'awaiting_response' && `No response in ${trackerState.daysSinceSent} days - send follow-up`}
                {trackerState.status === 'escalated' && `No response in ${trackerState.daysSinceSent} days - time to escalate!`}
              </span>
            </div>
            {trackerState.remindersSent > 0 && (
              <p className="text-xs mt-1 text-muted-foreground">
                Reminders sent: {trackerState.remindersSent}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {trackerState.status === 'not_sent' && (
            <>
              <Button size="sm" onClick={() => setShowEmail(!showEmail)} variant="outline" className="gap-1">
                <Mail className="w-3 h-3" />
                {showEmail ? 'Hide Email' : 'View Generated Email'}
              </Button>
              <Button size="sm" onClick={handleCopyEmail} className="gap-1">
                <Copy className="w-3 h-3" />
                Copy Email
              </Button>
              <Button size="sm" variant="outline" onClick={handleMarkSent} className="gap-1">
                <Send className="w-3 h-3" />
                Mark as Sent
              </Button>
            </>
          )}
          {(trackerState.status === 'awaiting_response' || trackerState.status === 'escalated') && (
            <Button size="sm" variant="destructive" onClick={handleSendReminder} className="gap-1">
              <RefreshCw className="w-3 h-3" />
              Copy Follow-Up Email
            </Button>
          )}
        </div>

        {/* Email Preview */}
        {showEmail && (
          <div className="border rounded-lg p-4 bg-gray-50 text-sm space-y-2 max-h-80 overflow-y-auto">
            <p className="font-medium text-xs text-muted-foreground">TO: {email.recipient}</p>
            <p className="font-semibold">{email.subject}</p>
            <hr />
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
              {email.body}
            </pre>
          </div>
        )}

        {/* Legal References */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Legal backing included:</p>
          {email.legalReferences.map((ref, i) => (
            <p key={i} className="flex items-start gap-1">
              <span className="text-primary">*</span> {ref}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
