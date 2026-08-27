/**
 * AI-generated diagnosis of why an EPFO claim is delayed.
 * Produced by the diagnosis service (OpenAI or rule-based fallback).
 */
export interface Diagnosis {
  /** Plain-language description of the bottleneck. */
  problem: string;
  /** Model confidence between 0 and 1. */
  confidence: number;
  /** Supporting evidence for the diagnosis. */
  evidence: string;
  /** Resolution strategy key (maps to a resolution guide). */
  resolution:
    | 'employerEmail'
    | 'fixKYC'
    | 'waitForEPFO'
    | 'trackRefund'
    | 'manual-review';
  /** Ordered human-readable steps to resolve the issue. */
  resolutionSteps?: string[];
}

/** A single notification event shown in the WhatsApp preview. */
export interface NotificationEvent {
  type: 'status_change' | 'blocker_detected' | 'settlement' | 'reminder';
  message: string;
  timestamp: Date;
}
