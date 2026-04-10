export type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_INFO' | 'MANUAL_REVIEW' | 'LEGAL_CONFLICT' | 'UNKNOWN';

export interface GuidanceItem {
  url?: string;
  title: string;
}

export interface ReasonItem {
  code?: string | null;
  field?: string | null;
  message: string;
}

export interface MissingFactItem {
  key: string;
  message: string;
}

export interface EligibilityStep {
  key: string;
  label: string;
  description: string;
}

export interface EligibilityCheckResult {
  decision_id?: string;
  status: EligibilityStatus;
  reasons?: ReasonItem[];
  missing_facts?: MissingFactItem[];
  guidance_items?: GuidanceItem[];
  benefit_details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  user_message?: string | null;
  disclaimer?: string | null;
}

export type BenefitCode =
  | 'TR_HOME_CARE_ALLOWANCE'
  | 'TR_GSS'
  | 'TR_OLD_AGE_PENSION'
  | 'TR_BIRTH_GRANT'
  | 'TR_DISABILITY_PENSION'
  | 'TR_COZGER_HOME_CARE_ALLOWANCE';

export interface EvaluationRequest {
  benefit_code: BenefitCode;
  facts: Record<string, unknown>;
  context?: {
    jurisdiction?: string;
    request_id?: string;
  };
}