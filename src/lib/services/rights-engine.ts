import type { ClaimStatus, ClaimStages } from '@/types/claim';
import { differenceInDays } from 'date-fns';

export interface CitizenRight {
  title: string;
  description: string;
  legalBasis: string;
  applicableWhen: string;
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * Get context-aware citizen rights based on current claim stage and delay.
 */
export function getRightsForClaim(claim: ClaimStatus): CitizenRight[] {
  const daysDelayed = differenceInDays(new Date(), claim.filingDate);
  const rights: CitizenRight[] = [];

  // Always applicable
  rights.push({
    title: 'Right to Settlement Within 3 Days',
    description: 'Under the new CITES system (July 2026), EPFO must auto-settle claims within 3 working days once all documentation is complete.',
    legalBasis: 'CITES Guidelines 2026, EPFO Office Order dated July 2026',
    applicableWhen: 'Always - for all new claims filed after July 2026',
  });

  // Stage-specific rights
  if (claim.currentStage === 'employerApproval') {
    rights.push({
      title: 'Employer Must Update Date of Exit Within 2 Days',
      description: 'Your employer is legally required to update your Date of Exit in the EPFO portal within 2 working days of your separation.',
      legalBasis: 'EPFO Circular No. CPFC/05/2023',
      applicableWhen: `Your employer has not acted for ${daysDelayed} days (exceeds 2-day mandate)`,
      actionUrl: 'https://epfigms.gov.in/',
      actionLabel: 'File grievance against employer',
    });

    if (daysDelayed > 7) {
      rights.push({
        title: 'Right to File Grievance After 7 Days',
        description: 'If your employer has not acted within 7 days, you have the right to file a formal grievance on EPFiGMS requesting EPFO intervention.',
        legalBasis: 'EPFiGMS Guidelines, EPFO Citizen Charter',
        applicableWhen: `Employer inaction for ${daysDelayed} days (exceeds 7-day threshold)`,
        actionUrl: 'https://epfigms.gov.in/',
        actionLabel: 'File EPFiGMS Grievance',
      });
    }

    if (daysDelayed > 14) {
      rights.push({
        title: 'Right to Penal Damages from Employer',
        description: 'EPFO can impose penal damages on employers who delay beyond mandated timelines. You can request this in your grievance.',
        legalBasis: 'EPF Act 1952, Section 14B - Penalty for default in payment',
        applicableWhen: `Employer delay of ${daysDelayed} days warrants penal action`,
      });
    }
  }

  if (claim.currentStage === 'kycVerification') {
    rights.push({
      title: 'Right to Know Specific KYC Issue',
      description: 'EPFO must inform you of the exact KYC mismatch causing rejection. They cannot simply reject without specifying the issue.',
      legalBasis: 'EPFO Citizen Charter, Natural Justice Principles',
      applicableWhen: 'KYC verification has failed or is blocked',
    });
  }

  // Delay-based rights
  if (daysDelayed > 20) {
    rights.push({
      title: 'Right to File RTI Application',
      description: 'You can file an RTI to know: who is handling your claim, why it is delayed, and what action has been taken. EPFO must respond within 30 days.',
      legalBasis: 'Right to Information Act 2005, Section 7(1)',
      applicableWhen: `Claim pending ${daysDelayed} days - RTI is appropriate`,
      actionUrl: 'https://rtionline.gov.in/',
      actionLabel: 'File RTI Online (Rs 10)',
    });

    rights.push({
      title: 'Right to Escalate to CPGRAMS',
      description: 'If EPFiGMS does not resolve your issue, you can escalate to the Central Public Grievance Portal (CPGRAMS) under the PM Office.',
      legalBasis: 'CPGRAMS Guidelines, Administrative Reforms Commission',
      applicableWhen: `After ${daysDelayed} days and EPFiGMS non-resolution`,
      actionUrl: 'https://pgportal.gov.in/',
      actionLabel: 'File on CPGRAMS',
    });
  }

  if (daysDelayed > 30) {
    rights.push({
      title: 'Right to Interest on Delayed Settlement',
      description: 'If EPFO delays beyond 30 days (without valid reason), you may be entitled to interest on the delayed amount as per EPFO circular.',
      legalBasis: 'EPF Scheme 1952, Para 72(7) - Interest for delayed payment',
      applicableWhen: `${daysDelayed} days exceeds 30-day threshold for interest claim`,
    });
  }

  // Universal right
  rights.push({
    title: 'Right to Toll-Free Helpline',
    description: 'EPFO operates a toll-free helpline (14470 / 1800-118-005) where you can register your complaint and get a ticket number for tracking.',
    legalBasis: 'EPFO Citizen Charter',
    applicableWhen: 'Always available - call between 9:15 AM to 5:45 PM',
  });

  return rights;
}
