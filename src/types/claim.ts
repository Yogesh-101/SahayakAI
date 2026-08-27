/** Status of a single stage in the EPFO claim pipeline. */
export interface StageStatus {
  /** Current status of this stage. */
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  /** When the claim entered this stage. */
  enteredAt: Date;
  /** When this stage was completed (undefined if still active). */
  completedAt?: Date;
  /** Human-readable reason if status is 'blocked'. */
  blockerReason?: string;
}

/** The four sequential stages every EPFO claim passes through. */
export interface ClaimStages {
  employerApproval: StageStatus;
  kycVerification: StageStatus;
  epfoSanction: StageStatus;
  paymentProcessing: StageStatus;
}

/** Full status object for a single EPFO claim. */
export interface ClaimStatus {
  /** Universal Account Number (unique per EPFO member). */
  uan: string;
  /** Claim reference number issued by EPFO on filing. */
  claimId: string;
  /** Type of claim filed by the member. */
  claimType: 'withdrawal' | 'loan' | 'pension';
  /** Claim amount in INR. */
  amount: number;
  /** Date the claim was filed on the EPFO portal. */
  filingDate: Date;
  /** Granular status of each processing stage. */
  stages: ClaimStages;
  /** Key of the stage the claim is currently at. */
  currentStage: keyof ClaimStages;
  /** AI-predicted settlement date (undefined if unpredictable). */
  estimatedSettlement?: Date;
  /** Name of the member (for display). */
  memberName: string;
  /** Name of the employer linked to this claim. */
  employerName: string;
}

/** Ordered list of stage keys matching the processing pipeline. */
export const STAGE_ORDER: (keyof ClaimStages)[] = [
  'employerApproval',
  'kycVerification',
  'epfoSanction',
  'paymentProcessing',
];

/** Human-readable labels for each stage. */
export const STAGE_LABELS: Record<keyof ClaimStages, string> = {
  employerApproval: 'Employer Approval',
  kycVerification: 'KYC Verification',
  epfoSanction: 'EPFO Sanction',
  paymentProcessing: 'Payment Processing',
};

/** Hindi labels for each stage. */
export const STAGE_LABELS_HI: Record<keyof ClaimStages, string> = {
  employerApproval: 'नियोक्ता की स्वीकृति',
  kycVerification: 'KYC सत्यापन',
  epfoSanction: 'EPFO मंजूरी',
  paymentProcessing: 'भुगतान प्रक्रिया',
};
