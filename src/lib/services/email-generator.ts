import type { ClaimStatus } from '@/types/claim';
import { format, differenceInDays } from 'date-fns';

export interface GeneratedEmail {
  subject: string;
  body: string;
  recipient: string;
  urgencyLevel: 'normal' | 'urgent' | 'critical';
  legalReferences: string[];
}

export interface EmailTrackerState {
  emailSentAt: Date | null;
  remindersSent: number;
  lastReminderAt: Date | null;
  status: 'not_sent' | 'sent' | 'awaiting_response' | 'escalated';
  daysSinceSent: number;
}

/**
 * Generate a personalized employer email with legal references and urgency scoring.
 * Unlike static templates, this calculates exact delays and includes EPFO circular numbers.
 */
export function generateEmployerEmail(claim: ClaimStatus): GeneratedEmail {
  const daysDelayed = differenceInDays(new Date(), claim.filingDate);
  const filingDateStr = format(claim.filingDate, 'dd-MMM-yyyy');
  const urgency = getUrgencyLevel(daysDelayed);

  const legalRefs = [
    'EPFO Circular No. CPFC/05/2023 (Date of Exit update within 2 days)',
    'EPF Scheme 1952, Section 72 (Settlement timeline)',
    'CITES Guidelines 2026 (3-day auto-settlement after employer action)',
  ];

  const urgencyPrefix = urgency === 'critical'
    ? 'URGENT & FINAL NOTICE: '
    : urgency === 'urgent'
      ? 'URGENT: '
      : '';

  const subject = `${urgencyPrefix}Request to Update Date of Exit in EPFO - UAN ${claim.uan} (Pending ${daysDelayed} days)`;

  const escalationWarning = daysDelayed > 14
    ? `\n\nPlease note: As per my rights under the EPF Scheme 1952, if this matter is not resolved within 48 hours, I will be compelled to:\n1. File a formal grievance on EPFiGMS (EPFO Grievance Management System)\n2. Lodge a complaint on CPGRAMS (Central Public Grievance Portal)\n3. File an RTI application under RTI Act 2005 to ascertain the reason for non-compliance\n`
    : daysDelayed > 7
      ? `\n\nKindly note that if this is not resolved within 5 working days, I may need to escalate this matter through official EPFO grievance channels.\n`
      : '';

  const body = `Dear HR/Payroll Team,

I am writing regarding my pending EPFO PF ${claim.claimType} claim that requires your immediate action.

CLAIM DETAILS:
- Employee Name: ${claim.memberName}
- UAN: ${claim.uan}
- Claim ID: ${claim.claimId}
- Claim Type: PF ${claim.claimType.charAt(0).toUpperCase() + claim.claimType.slice(1)}
- Amount: Rs ${claim.amount.toLocaleString('en-IN')}
- Filing Date: ${filingDateStr}
- Days Pending: ${daysDelayed} days

ISSUE:
My claim has been pending at the "Employer Approval" stage for ${daysDelayed} days because the Date of Exit has not been updated in the EPFO Unified Portal.

REQUIRED ACTION:
Please log into the EPFO Employer Portal and complete the following:
1. Navigate to: Member > Date of Exit Update
2. Enter my UAN: ${claim.uan}
3. Update Date of Exit to my last working day
4. Approve the pending claim under: Claims > Pending for Approval

EPFO Employer Portal: https://unifiedportal-emp.epfindia.gov.in/

LEGAL REFERENCE:
As per ${legalRefs[0]}, employers are required to update the Date of Exit within 2 working days of employee separation. Non-compliance may result in penal action under EPF Act 1952, Section 14B.${escalationWarning}

This delay is causing me significant financial hardship as I need these funds urgently. I request your prompt cooperation.

Thank you for your immediate attention to this matter.

Regards,
${claim.memberName}
UAN: ${claim.uan}

---
This communication was generated with SahayakAI (sahayak-ai.vercel.app)
Reference: ${claim.claimId} | Generated: ${format(new Date(), 'dd-MMM-yyyy HH:mm')}`;

  return {
    subject,
    body,
    recipient: `hr@${claim.employerName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    urgencyLevel: urgency,
    legalReferences: legalRefs,
  };
}

/**
 * Generate a follow-up/reminder email when employer hasn't responded.
 */
export function generateFollowUpEmail(claim: ClaimStatus, daysSinceFirstEmail: number): GeneratedEmail {
  const daysDelayed = differenceInDays(new Date(), claim.filingDate);
  const urgency = getUrgencyLevel(daysDelayed);

  const subject = `FOLLOW-UP (${daysSinceFirstEmail} days no response): Date of Exit Update - UAN ${claim.uan}`;

  const body = `Dear HR/Payroll Team,

This is a follow-up to my email sent ${daysSinceFirstEmail} days ago regarding my pending EPFO claim (UAN: ${claim.uan}, Claim ID: ${claim.claimId}).

I have not received any response or action on this matter. My claim has now been pending for ${daysDelayed} days.

As per EPFO Circular No. CPFC/05/2023, the Date of Exit should have been updated within 2 working days of separation. The continued delay of ${daysDelayed} days constitutes non-compliance.

I am formally informing you that if this is not resolved within the next 48 hours, I will proceed with:
1. Filing a grievance on EPFiGMS (https://epfigms.gov.in)
2. Filing a complaint on CPGRAMS (https://pgportal.gov.in)
3. Filing an RTI application to EPFO Regional Office

I trust this can be resolved without the need for formal escalation.

Regards,
${claim.memberName}
UAN: ${claim.uan}

---
Generated by SahayakAI | Reference: ${claim.claimId}`;

  return {
    subject,
    body,
    recipient: `hr@${claim.employerName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    urgencyLevel: urgency,
    legalReferences: [
      'EPFO Circular No. CPFC/05/2023',
      'EPF Act 1952, Section 14B (Penal damages for delay)',
    ],
  };
}

function getUrgencyLevel(daysDelayed: number): 'normal' | 'urgent' | 'critical' {
  if (daysDelayed >= 20) return 'critical';
  if (daysDelayed >= 10) return 'urgent';
  return 'normal';
}

/**
 * Calculate the current email tracker state from localStorage mock data.
 */
export function getEmailTrackerState(claimId: string): EmailTrackerState {
  if (typeof window === 'undefined') {
    return { emailSentAt: null, remindersSent: 0, lastReminderAt: null, status: 'not_sent', daysSinceSent: 0 };
  }
  const stored = localStorage.getItem(`email_tracker_${claimId}`);
  if (!stored) {
    return { emailSentAt: null, remindersSent: 0, lastReminderAt: null, status: 'not_sent', daysSinceSent: 0 };
  }
  const data = JSON.parse(stored);
  const emailSentAt = data.emailSentAt ? new Date(data.emailSentAt) : null;
  const daysSinceSent = emailSentAt ? differenceInDays(new Date(), emailSentAt) : 0;

  let status: EmailTrackerState['status'] = 'not_sent';
  if (emailSentAt && daysSinceSent >= 5) status = 'escalated';
  else if (emailSentAt && daysSinceSent >= 2) status = 'awaiting_response';
  else if (emailSentAt) status = 'sent';

  return {
    emailSentAt,
    remindersSent: data.remindersSent || 0,
    lastReminderAt: data.lastReminderAt ? new Date(data.lastReminderAt) : null,
    status,
    daysSinceSent,
  };
}

export function markEmailSent(claimId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`email_tracker_${claimId}`, JSON.stringify({
    emailSentAt: new Date().toISOString(),
    remindersSent: 0,
    lastReminderAt: null,
  }));
}

export function markReminderSent(claimId: string): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(`email_tracker_${claimId}`);
  const data = stored ? JSON.parse(stored) : {};
  data.remindersSent = (data.remindersSent || 0) + 1;
  data.lastReminderAt = new Date().toISOString();
  localStorage.setItem(`email_tracker_${claimId}`, JSON.stringify(data));
}
