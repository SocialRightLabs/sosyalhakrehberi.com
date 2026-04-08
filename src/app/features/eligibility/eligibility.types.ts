export type EligibilityStatus =
  | 'ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'NEEDS_INFO'
  | 'MANUAL_REVIEW'
  | 'LEGAL_CONFLICT'
  | 'UNKNOWN';

export interface EligibilityFact {
  key: string;
  message: string;
}

export interface EligibilityReason {
  code?: string | null;
  field?: string | null;
  message: string;
}

export interface EligibilityCheckResult {
  status: EligibilityStatus;
  reasons: EligibilityReason[];
  missing_facts: EligibilityFact[];
  user_message: string | null;
  disclaimer: string | null;
  guidance_items: string[];
}

export interface EligibilityStep {
  key: 'kimlik' | 'saglik' | 'hane';
  label: string;
  description: string;
}
