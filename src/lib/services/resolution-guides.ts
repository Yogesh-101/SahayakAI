import type { Diagnosis } from '@/types/diagnosis';

/**
 * Resolution guides for different types of EPFO claim bottlenecks.
 * Provides detailed, actionable steps for citizens to resolve issues.
 */

export interface ResolutionGuide {
  title: string;
  description: string;
  steps: Array<{
    title: string;
    description: string;
    links?: Array<{ label: string; url: string }>;
  }>;
  estimatedTime: string;
  helplineNumbers: string[];
}

/**
 * Get detailed resolution guide for a diagnosis.
 */
export function getResolutionGuide(
  resolutionType: Diagnosis['resolution'],
): ResolutionGuide {
  return RESOLUTION_GUIDES[resolutionType] ?? RESOLUTION_GUIDES['manual-review'];
}

const RESOLUTION_GUIDES: Record<Diagnosis['resolution'], ResolutionGuide> = {
  employerEmail: {
    title: 'Get Employer Approval',
    description:
      'Your employer needs to approve your claim on the EPFO portal. Follow these steps to expedite the process.',
    steps: [
      {
        title: '1. Contact HR/Payroll Department',
        description:
          'Reach out to your HR or payroll team via email or phone. Be polite but clear that you need urgent approval.',
      },
      {
        title: '2. Provide Claim Details',
        description:
          'Share your UAN, claim ID, and filing date. This helps them locate your claim quickly in the EPFO portal.',
      },
      {
        title: '3. Request Portal Login',
        description:
          'Ask them to log into the EPFO Unified Portal (Establishment Login) and navigate to Claims > Pending Approvals.',
        links: [
          {
            label: 'EPFO Unified Portal',
            url: 'https://unifiedportal-mem.epfindia.gov.in/',
          },
        ],
      },
      {
        title: '4. Follow Up Regularly',
        description:
          'If no response within 2-3 days, send a polite reminder. Escalate to senior management if delayed beyond 7 days.',
      },
      {
        title: '5. File Grievance (if needed)',
        description:
          'If employer continues to delay, file a grievance on the EPFO portal or call the helpline.',
        links: [
          {
            label: 'EPFO Grievance Portal',
            url: 'https://epfigms.gov.in/login/',
          },
        ],
      },
    ],
    estimatedTime: '3-7 business days',
    helplineNumbers: ['1800-118-005 (EPFO Toll-Free)', '011-2273-9252 (EPFO HQ Delhi)'],
  },

  fixKYC: {
    title: 'Fix KYC Mismatch',
    description:
      'Your KYC documents (Aadhaar, PAN, bank account) don\'t match EPFO records. Update them to unblock your claim.',
    steps: [
      {
        title: '1. Log into EPFO Member Portal',
        description:
          'Visit the EPFO Unified Member Portal and log in using your UAN and password.',
        links: [
          {
            label: 'EPFO Member Portal',
            url: 'https://unifiedportal-mem.epfindia.gov.in/',
          },
        ],
      },
      {
        title: '2. Go to Manage > KYC',
        description:
          'Navigate to the "Manage" section and click on "KYC". Check which documents are marked as mismatched.',
      },
      {
        title: '3. Update Mismatched Documents',
        description:
          'Upload fresh scanned copies of Aadhaar, PAN, and bank passbook/cancelled cheque. Ensure spelling, dates, and account numbers match exactly.',
      },
      {
        title: '4. Verify Aadhaar via OTP',
        description:
          'If Aadhaar is not seeded, click "Verify Aadhaar" and complete OTP verification.',
      },
      {
        title: '5. Wait for Approval',
        description:
          'KYC verification typically takes 24-48 hours. Check the portal daily for updates.',
      },
    ],
    estimatedTime: '2-3 business days',
    helplineNumbers: ['1800-118-005 (EPFO Toll-Free)', '011-2273-9252 (EPFO HQ Delhi)'],
  },

  waitForEPFO: {
    title: 'Normal Processing - Wait for EPFO',
    description:
      'Your claim is being processed and there are no blockers from your side. EPFO typically settles claims within 15-20 working days.',
    steps: [
      {
        title: '1. Monitor Daily',
        description:
          'Check the EPFO portal or SahayakAI daily for status updates. You will be notified when the claim moves to the next stage.',
        links: [
          {
            label: 'EPFO Member Portal',
            url: 'https://unifiedportal-mem.epfindia.gov.in/',
          },
        ],
      },
      {
        title: '2. No Action Required',
        description:
          'Your claim is progressing normally. No action is needed from your side at this time.',
      },
      {
        title: '3. Call Helpline if Delayed',
        description:
          'If processing takes longer than 20 working days, call EPFO helpline for an update.',
      },
    ],
    estimatedTime: '15-20 working days',
    helplineNumbers: ['1800-118-005 (EPFO Toll-Free)', '011-2273-9252 (EPFO HQ Delhi)'],
  },

  trackRefund: {
    title: 'Track Payment/Refund',
    description:
      'Payment to your bank account has failed or is delayed. Verify your bank details and track the refund process.',
    steps: [
      {
        title: '1. Check Bank Account Details',
        description:
          'Log into EPFO portal and verify that your bank account number and IFSC code are correct.',
        links: [
          {
            label: 'EPFO Member Portal',
            url: 'https://unifiedportal-mem.epfindia.gov.in/',
          },
        ],
      },
      {
        title: '2. Contact Your Bank',
        description:
          'Call your bank to check if there are any blocks or issues with your account that might prevent credit.',
      },
      {
        title: '3. Update Bank Details if Needed',
        description:
          'If your account has changed or is inactive, update bank details in the EPFO portal (requires verification).',
      },
      {
        title: '4. Track Refund Status',
        description:
          'If payment failed, EPFO will retry after you update details. Track refund status on the portal.',
      },
      {
        title: '5. Call EPFO Helpline',
        description:
          'If payment is not received within 3-5 days after account update, call EPFO helpline with your claim ID.',
      },
    ],
    estimatedTime: '3-7 business days',
    helplineNumbers: ['1800-118-005 (EPFO Toll-Free)', '011-2273-9252 (EPFO HQ Delhi)'],
  },

  'manual-review': {
    title: 'Manual Review Required',
    description:
      'Your claim has been flagged for manual review by EPFO officers. Contact the regional office for details.',
    steps: [
      {
        title: '1. Find Your Regional Office',
        description:
          'Identify your EPFO Regional Office based on your employer location. Contact details are available on the EPFO website.',
        links: [
          {
            label: 'EPFO Regional Offices',
            url: 'https://www.epfindia.gov.in/site_en/Contacts.php',
          },
        ],
      },
      {
        title: '2. Call the Sanctioning Officer',
        description:
          'Ask to speak with the officer handling your claim. Provide your UAN and claim ID.',
      },
      {
        title: '3. Ask for Specific Reason',
        description:
          'Request the exact reason your claim was flagged and what documents or actions are needed.',
      },
      {
        title: '4. Submit Additional Documents',
        description:
          'If any documents are required, upload them via the EPFO portal or submit physically at the regional office.',
      },
      {
        title: '5. File Grievance if Needed',
        description:
          'If the issue is not resolved within 7-10 days, file an online grievance on the EPFO portal.',
        links: [
          {
            label: 'EPFO Grievance Portal',
            url: 'https://epfigms.gov.in/login/',
          },
        ],
      },
    ],
    estimatedTime: '7-15 business days',
    helplineNumbers: ['1800-118-005 (EPFO Toll-Free)', '011-2273-9252 (EPFO HQ Delhi)'],
  },
};
