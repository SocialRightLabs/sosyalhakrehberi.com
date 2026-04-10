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
  explanation?: string | null;
  legal_basis?: string[] | Record<string, unknown> | null;
  thresholds_used?: Array<Record<string, unknown>> | Record<string, unknown> | null;
  rule_version?: string | null;
  evaluated_at?: string | null;
}

export interface DecisionExplainabilityItem {
  rule_code: string;
  passed?: boolean;
  message?: string | null;
  value?: unknown;
  threshold?: unknown;
  law_reference?: string | null;
  article?: string | null;
  description?: string | null;
}

export interface DecisionExplainabilityResponse {
  decision_id: string | number;
  explanations: DecisionExplainabilityItem[];
}

export interface DecisionTraceItem {
  rule_code: string;
  passed?: boolean;
  value?: unknown;
  threshold?: unknown;
  message?: string | null;
  severity?: string | null;
  evaluated_at?: string | null;
}

export interface DecisionTraceResponse {
  decision_id: string | number;
  trace_id?: string | number;
  created_at?: string | null;
  rule_evaluations: DecisionTraceItem[];
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

export type TestFieldType = 'select' | 'number' | 'checkbox' | 'text' | 'date';

export interface TestFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface TestFieldConfig {
  key: string;
  label: string;
  type: TestFieldType;
  placeholder?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: TestFieldOption[];
}

export interface BenefitTestConfig {
  benefitCode: BenefitCode;
  route: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  roadmapKey: BenefitCode;
  fields: TestFieldConfig[];
}
