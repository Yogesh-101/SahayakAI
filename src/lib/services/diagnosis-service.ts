import OpenAI from 'openai';
import type { Diagnosis } from '@/types/diagnosis';
import type { ClaimStatus } from '@/types/claim';

/**
 * AI-powered diagnosis service for EPFO claim bottlenecks.
 * Uses OpenAI GPT-3.5-Turbo to analyze claim status and generate actionable diagnosis.
 */

// Initialize OpenAI client (will be undefined if no API key)
function getOpenAIClient(): OpenAI | undefined {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey === 'sk-proj-your-actual-key-here' || apiKey.startsWith('sk-proj-...')) {
    return undefined;
  }
  return new OpenAI({ apiKey });
}

export type DiagnosisSource = 'openai' | 'rules';

export interface DiagnosisResult {
  diagnosis: Diagnosis;
  source: DiagnosisSource;
}

/**
 * Diagnose why a claim is delayed or blocked.
 * Falls back to rule-based diagnosis if OpenAI is unavailable.
 */
export async function diagnoseClaimBottleneck(
  claim: ClaimStatus,
): Promise<DiagnosisResult> {
  const openai = getOpenAIClient();

  if (openai) {
    try {
      const diagnosis = await diagnoseWithOpenAI(openai, claim);
      return { diagnosis, source: 'openai' };
    } catch (error) {
      console.error('[Diagnosis Service] OpenAI failed, falling back to rules:', error);
      return { diagnosis: diagnoseWithRules(claim), source: 'rules' };
    }
  }

  return { diagnosis: diagnoseWithRules(claim), source: 'rules' };
}

/**
 * AI-powered diagnosis using OpenAI GPT-3.5-Turbo.
 */
async function diagnoseWithOpenAI(openai: OpenAI, claim: ClaimStatus): Promise<Diagnosis> {
  const currentStageData = claim.stages[claim.currentStage];
  const stageStatus = currentStageData.status;

  // Build context for OpenAI
  const context = `
EPFO Claim Analysis:
- Claim ID: ${claim.claimId}
- UAN: ${claim.uan}
- Claim Type: ${claim.claimType}
- Amount: ₹${claim.amount.toLocaleString('en-IN')}
- Filing Date: ${claim.filingDate.toISOString().split('T')[0]}
- Current Stage: ${claim.currentStage}
- Stage Status: ${stageStatus}
- Blocker Reason: ${currentStageData.blockerReason || 'None'}
- Days in Current Stage: ${Math.floor((Date.now() - currentStageData.enteredAt.getTime()) / (1000 * 60 * 60 * 24))}

Analyze this EPFO claim and provide:
1. A plain-language problem description (2-3 sentences)
2. Confidence level (0-1)
3. Supporting evidence
4. Resolution strategy: one of [employerEmail, fixKYC, waitForEPFO, trackRefund, manual-review]
5. 3-5 actionable resolution steps

Respond ONLY with valid JSON in this format:
{
  "problem": "string",
  "confidence": number,
  "evidence": "string",
  "resolution": "string",
  "resolutionSteps": ["step1", "step2", ...]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert at diagnosing delays in Indian EPFO (Employees Provident Fund) claims. Provide clear, actionable diagnosis in JSON format.',
      },
      {
        role: 'user',
        content: context,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  // Parse JSON response
  const parsed = JSON.parse(content) as Diagnosis;

  // Validate required fields
  if (!parsed.problem || !parsed.resolution) {
    throw new Error('OpenAI response missing required fields');
  }

  return {
    problem: parsed.problem,
    confidence: parsed.confidence ?? 0.7,
    evidence: parsed.evidence ?? 'AI analysis',
    resolution: parsed.resolution as Diagnosis['resolution'],
    resolutionSteps: parsed.resolutionSteps ?? [],
  };
}

/**
 * Rule-based diagnosis fallback (no API key required).
 */
function diagnoseWithRules(claim: ClaimStatus): Diagnosis {
  const currentStageData = claim.stages[claim.currentStage];
  const stageStatus = currentStageData.status;
  const daysInStage = Math.floor(
    (Date.now() - currentStageData.enteredAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Check for blocked status
  if (stageStatus === 'blocked') {
    const blockerReason = currentStageData.blockerReason || 'Unknown reason';

    // Employer approval blocked
    if (claim.currentStage === 'employerApproval') {
      return {
        problem: `Your employer has not approved your claim yet. ${blockerReason}`,
        confidence: 0.9,
        evidence: `Claim has been waiting at employer approval stage for ${daysInStage} days.`,
        resolution: 'employerEmail',
        resolutionSteps: [
          'Contact your HR or payroll department',
          'Ask them to log into the EPFO Unified Portal',
          'Request immediate approval of your PF claim',
          'Follow up every 2-3 business days if no response',
          'Escalate to senior management if delayed beyond 7 days',
        ],
      };
    }

    // KYC verification blocked
    if (claim.currentStage === 'kycVerification') {
      return {
        problem: `Your KYC documents don't match EPFO records. ${blockerReason}`,
        confidence: 0.85,
        evidence: `KYC verification has been stuck for ${daysInStage} days.`,
        resolution: 'fixKYC',
        resolutionSteps: [
          'Log into EPFO Unified Member Portal',
          'Go to "Manage" → "KYC"',
          'Update Aadhaar, PAN, and bank details',
          'Ensure all documents match exactly (spelling, dates)',
          'Upload fresh scanned copies if required',
          'Wait 48 hours for re-verification',
        ],
      };
    }

    // EPFO sanction blocked
    if (claim.currentStage === 'epfoSanction') {
      return {
        problem: `EPFO has flagged your claim for manual review. ${blockerReason}`,
        confidence: 0.75,
        evidence: `Claim stuck at EPFO sanction stage for ${daysInStage} days.`,
        resolution: 'manual-review',
        resolutionSteps: [
          'Call EPFO Regional Office (find number on EPFO portal)',
          'Ask to speak with the sanctioning officer',
          'Provide your UAN and claim ID',
          'Ask for specific reason and required documents',
          'Submit any additional documents via portal',
        ],
      };
    }

    // Payment processing blocked
    if (claim.currentStage === 'paymentProcessing') {
      return {
        problem: `Payment could not be processed to your bank account. ${blockerReason}`,
        confidence: 0.8,
        evidence: `Payment has failed or been delayed for ${daysInStage} days.`,
        resolution: 'trackRefund',
        resolutionSteps: [
          'Verify your bank account details in EPFO portal',
          'Ensure account is active and not frozen',
          'Contact your bank to check for any blocks',
          'Update bank details if account has changed',
          'Track refund status on EPFO portal',
        ],
      };
    }
  }

  // Check for unusually long in_progress
  if (stageStatus === 'in_progress' && daysInStage > 7) {
    return {
      problem: `Your claim is taking longer than expected at the ${claim.currentStage} stage.`,
      confidence: 0.6,
      evidence: `Processing has been ongoing for ${daysInStage} days, which exceeds the typical 3-5 day timeframe.`,
      resolution: 'waitForEPFO',
      resolutionSteps: [
        'This is likely due to high processing volume',
        'EPFO typically processes claims within 15-20 working days',
        'Continue monitoring the portal daily',
        'If delayed beyond 20 days, call EPFO helpline: 1800-118-005',
      ],
    };
  }

  // Normal processing
  return {
    problem: `Your claim is being processed normally at the ${claim.currentStage} stage.`,
    confidence: 0.7,
    evidence: `Claim entered this stage ${daysInStage} days ago and is progressing as expected.`,
    resolution: 'waitForEPFO',
    resolutionSteps: [
      'No action required from your side',
      'Check back in 2-3 business days',
      'Estimated settlement: ' + (claim.estimatedSettlement
        ? new Date(claim.estimatedSettlement).toLocaleDateString('en-IN')
        : 'within 15-20 working days'),
    ],
  };
}
