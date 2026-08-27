'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { MessageCircle, Check, CheckCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { NotificationEvent } from '@/types/diagnosis';
import type { ClaimStatus } from '@/types/claim';

interface WhatsAppPreviewProps {
  claim: ClaimStatus;
}

export default function WhatsAppPreview({ claim }: WhatsAppPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  // Generate mock notification history based on claim status
  const notifications = generateNotifications(claim);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <MessageCircle className="w-6 h-6 text-secondary-600 shrink-0" />
          <div className="flex-1">
            <CardTitle className="text-lg">WhatsApp Notifications</CardTitle>
            <CardDescription>
              Real-time alerts sent directly to your phone (India Stack integration)
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs bg-secondary-50">
            🇮🇳 DEMO
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* WhatsApp-style chat UI */}
        <div className="rounded-lg border bg-[#ECE5DD] p-4 space-y-3 max-h-96 overflow-y-auto">
          {notifications
            .slice(0, expanded ? undefined : 3)
            .map((notification, idx) => (
              <WhatsAppMessage
                key={idx}
                notification={notification}
                isLatest={idx === notifications.length - 1}
              />
            ))}

          {!expanded && notifications.length > 3 && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-2"
            >
              + {notifications.length - 3} older messages
            </button>
          )}
        </div>

        {/* Integration note */}
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Production Integration:</strong> Uses India Stack's WhatsApp
            Business API for real-time notifications.
          </p>
          <p>
            Citizens receive updates at every stage without checking the portal.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function WhatsAppMessage({
  notification,
  isLatest,
}: {
  notification: NotificationEvent;
  isLatest: boolean;
}) {
  const bgColor = {
    status_change: 'bg-[#D9FDD3]',
    blocker_detected: 'bg-[#FFE5E5]',
    settlement: 'bg-[#D9FDD3]',
    reminder: 'bg-white',
  }[notification.type];

  const emoji = {
    status_change: '✅',
    blocker_detected: '🚨',
    settlement: '🎉',
    reminder: '⏰',
  }[notification.type];

  return (
    <div className={`rounded-lg ${bgColor} p-3 shadow-sm relative`}>
      <p className="text-sm text-gray-800 leading-relaxed">
        {emoji} {notification.message}
      </p>
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className="text-[10px] text-gray-500">
          {format(notification.timestamp, 'HH:mm')}
        </span>
        {isLatest ? (
          <CheckCheck className="w-3 h-3 text-blue-500" />
        ) : (
          <Check className="w-3 h-3 text-gray-400" />
        )}
      </div>
    </div>
  );
}

/**
 * Generate realistic notification history for a claim.
 */
function generateNotifications(claim: ClaimStatus): NotificationEvent[] {
  const events: NotificationEvent[] = [];

  // Filing notification
  events.push({
    type: 'status_change',
    message: `Your EPFO claim (₹${claim.amount.toLocaleString('en-IN')}) has been filed successfully. Track it here: sahayak.ai/claim/${claim.uan}`,
    timestamp: claim.filingDate,
  });

  // Employer approval stage
  const employerStage = claim.stages.employerApproval;
  if (employerStage.status === 'blocked') {
    events.push({
      type: 'blocker_detected',
      message: `⚠️ Your employer has not approved your claim yet. ${employerStage.blockerReason || 'Contact your HR department immediately.'}`,
      timestamp: new Date(
        employerStage.enteredAt.getTime() + 2 * 24 * 60 * 60 * 1000,
      ),
    });
    events.push({
      type: 'reminder',
      message: 'Reminder: Please follow up with your employer for claim approval. Tap for resolution steps.',
      timestamp: new Date(
        employerStage.enteredAt.getTime() + 5 * 24 * 60 * 60 * 1000,
      ),
    });
  } else if (employerStage.completedAt) {
    events.push({
      type: 'status_change',
      message: 'Your employer has approved your claim! Moving to KYC verification.',
      timestamp: employerStage.completedAt,
    });
  }

  // KYC stage
  const kycStage = claim.stages.kycVerification;
  if (kycStage.status === 'blocked') {
    events.push({
      type: 'blocker_detected',
      message: `🚨 KYC verification failed. ${kycStage.blockerReason || 'Please update your Aadhaar/PAN/Bank details on the EPFO portal.'}`,
      timestamp: new Date(kycStage.enteredAt.getTime() + 1 * 24 * 60 * 60 * 1000),
    });
  } else if (kycStage.completedAt) {
    events.push({
      type: 'status_change',
      message: 'KYC verified successfully! Your claim is now under EPFO review.',
      timestamp: kycStage.completedAt,
    });
  }

  // EPFO sanction stage
  const sanctionStage = claim.stages.epfoSanction;
  if (sanctionStage.status === 'blocked') {
    events.push({
      type: 'blocker_detected',
      message: `🚨 Your claim requires manual review. ${sanctionStage.blockerReason || 'Contact EPFO regional office for details.'}`,
      timestamp: new Date(
        sanctionStage.enteredAt.getTime() + 3 * 24 * 60 * 60 * 1000,
      ),
    });
  } else if (sanctionStage.completedAt) {
    events.push({
      type: 'status_change',
      message: 'Great news! EPFO has sanctioned your claim. Processing payment...',
      timestamp: sanctionStage.completedAt,
    });
  }

  // Payment stage
  const paymentStage = claim.stages.paymentProcessing;
  if (paymentStage.status === 'blocked') {
    events.push({
      type: 'blocker_detected',
      message: `🚨 Payment failed. ${paymentStage.blockerReason || 'Please verify your bank account details.'}`,
      timestamp: new Date(
        paymentStage.enteredAt.getTime() + 1 * 24 * 60 * 60 * 1000,
      ),
    });
  } else if (paymentStage.completedAt) {
    events.push({
      type: 'settlement',
      message: `🎉 ₹${claim.amount.toLocaleString('en-IN')} has been credited to your bank account! Your EPFO claim is now settled.`,
      timestamp: paymentStage.completedAt,
    });
  }

  // Sort by timestamp
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
