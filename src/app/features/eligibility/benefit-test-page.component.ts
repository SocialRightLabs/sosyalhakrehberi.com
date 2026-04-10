import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Api } from '../../services/api';
import { ExplanationPanelComponent, EligibilityTransparencyDetails } from './explanation-panel.component';
import { BenefitTestConfig, EligibilityCheckResult, EligibilityStatus, TestFieldConfig } from './eligibility.types';
import { BENEFIT_TEST_CONFIGS } from './benefit-test.config';
import { ResultCardComponent } from './result-card.component';
import { PlatformMetricsService } from './platform-metrics.service';
import { PlatformStatsStripComponent } from './platform-stats-strip.component';

@Component({
  standalone: true,
  selector: 'app-benefit-test-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ResultCardComponent, ExplanationPanelComponent, PlatformStatsStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './benefit-test-page.component.html',
  styleUrl: './benefit-test-page.component.scss',
})
export class BenefitTestPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(Api);
  readonly platformMetrics = inject(PlatformMetricsService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<EligibilityCheckResult | null>(null);
  readonly details = signal<EligibilityTransparencyDetails | null>(null);

  config: BenefitTestConfig = BENEFIT_TEST_CONFIGS['TR_BIRTH_GRANT'];
  form = this.fb.group({});

  readonly title = computed(() => this.config.title);

  ngOnInit(): void {
    const key = String(this.route.snapshot.data['testKey'] ?? 'TR_BIRTH_GRANT');
    this.config = BENEFIT_TEST_CONFIGS[key] ?? BENEFIT_TEST_CONFIGS['TR_BIRTH_GRANT'];
    this.form = this.buildForm(this.config.fields);
    void this.platformMetrics.recordVisit();
  }

  async submit(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.details.set(null);

    try {
      const response = await this.api.evaluateBenefit({
        benefit_code: this.config.benefitCode,
        facts: this.cleanFacts(this.form.getRawValue() as Record<string, unknown>),
        context: { jurisdiction: 'TR', request_id: `web_${Date.now()}` },
      });

      const result = this.normalizeResult(response);
      this.result.set(result);

      if (result.decision_id) {
        this.details.set(await this.loadTransparency(result.decision_id, result));
      }

      void this.platformMetrics.loadStats();
    } catch (error: unknown) {
      this.error.set(this.api.normalizeError(error));
    } finally {
      this.loading.set(false);
    }
  }

  reset(): void {
    this.form.reset(this.initialFormValue(this.config.fields));
    this.result.set(null);
    this.details.set(null);
    this.error.set(null);
  }

  fieldControlType(field: TestFieldConfig): 'select' | 'number' | 'checkbox' | 'text' | 'date' {
    return field.type;
  }

  isBooleanField(field: TestFieldConfig): boolean {
    return field.type === 'select' && Array.isArray(field.options) && field.options.some((option) => typeof option.value === 'boolean');
  }

  private buildForm(fields: TestFieldConfig[]) {
    const controls: Record<string, unknown> = {};

    for (const field of fields) {
      controls[field.key] = [this.initialValue(field)];
    }

    return this.fb.group(controls);
  }

  private initialFormValue(fields: TestFieldConfig[]): Record<string, unknown> {
    const values: Record<string, unknown> = {};

    for (const field of fields) {
      values[field.key] = this.initialValue(field);
    }

    return values;
  }

  private initialValue(field: TestFieldConfig): unknown {
    if (field.type === 'number') return null;
    if (field.type === 'checkbox') return false;
    return '';
  }

  private cleanFacts(formValue: Record<string, unknown>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(formValue)) {
      if (value !== null && value !== '') {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }

  private normalizeResult(response: unknown): EligibilityCheckResult {
    const data = response && typeof response === 'object' ? (response as Record<string, unknown>) : {};
    const status = this.normalizeStatus(data['status'] ?? data['outcome']);

    return {
      decision_id: typeof data['decision_id'] === 'string' ? data['decision_id'] : undefined,
      status,
      reasons: this.normalizeReasons(data['reasons']),
      missing_facts: this.normalizeMissingFacts(data['missing_facts']),
      guidance_items: this.normalizeGuidanceItems(data['guidance_items']),
      benefit_details: this.isRecord(data['benefit_details']) ? data['benefit_details'] : undefined,
      metadata: this.isRecord(data['metadata']) ? data['metadata'] : undefined,
      user_message: typeof data['user_message'] === 'string' ? data['user_message'] : null,
      disclaimer: typeof data['disclaimer'] === 'string' ? data['disclaimer'] : null,
      explanation: typeof data['explanation'] === 'string' ? data['explanation'] : null,
      rule_version: typeof data['rule_version'] === 'string' ? data['rule_version'] : null,
      evaluated_at: typeof data['evaluated_at'] === 'string' ? data['evaluated_at'] : null,
    };
  }

  private async loadTransparency(decisionId: string, result: EligibilityCheckResult): Promise<EligibilityTransparencyDetails | null> {
    try {
      const [explain, trace] = await Promise.all([
        this.api.explainDecision(decisionId),
        this.api.traceDecision(decisionId),
      ]);

      const explanations = Array.isArray(explain.explanations) ? explain.explanations : [];
      const traceEvaluations = Array.isArray(trace.rule_evaluations) ? trace.rule_evaluations : [];
      const legalBasis = this.collectLegalBasis(explanations);
      const thresholdsUsed = traceEvaluations.map((item) => ({
        rule_code: item.rule_code,
        value: item.value,
        threshold: item.threshold,
      }));

      return {
        explanations,
        traceEvaluations,
        legalBasis,
        thresholdsUsed,
        ruleVersion: this.extractRuleVersion(result),
        evaluatedAt: this.extractEvaluatedAt(trace, result),
      };
    } catch {
      return null;
    }
  }

  private extractRuleVersion(result: EligibilityCheckResult): string | null {
    const metadata = result.metadata;
    if (metadata && typeof metadata === 'object') {
      const policyVersion = metadata['policy_version'];
      if (typeof policyVersion === 'string' && policyVersion.trim() !== '') {
        return policyVersion.trim();
      }
    }
    return result.rule_version ?? null;
  }

  private extractEvaluatedAt(trace: { created_at?: string | null; rule_evaluations?: Array<{ evaluated_at?: string | null }> }, result: EligibilityCheckResult): string | null {
    if (typeof trace.created_at === 'string' && trace.created_at.trim() !== '') {
      return trace.created_at;
    }

    const firstEvaluation = trace.rule_evaluations?.find((item) => typeof item.evaluated_at === 'string' && item.evaluated_at.trim() !== '');
    if (firstEvaluation?.evaluated_at) {
      return firstEvaluation.evaluated_at;
    }

    return result.evaluated_at ?? null;
  }

  private collectLegalBasis(explanations: Array<{ law_reference?: string | null; article?: string | null; description?: string | null }>): string[] {
    const basis = explanations
      .map((item) => {
        const parts = [item.law_reference, item.article, item.description].filter((value): value is string => typeof value === 'string' && value.trim() !== '');
        return parts.join(' - ');
      })
      .filter((value) => value.trim() !== '');

    return Array.from(new Set(basis));
  }

  private normalizeStatus(value: unknown): EligibilityStatus {
    const status = String(value ?? '').toUpperCase();

    if (
      status === 'ELIGIBLE' ||
      status === 'NOT_ELIGIBLE' ||
      status === 'NEEDS_INFO' ||
      status === 'MANUAL_REVIEW' ||
      status === 'LEGAL_CONFLICT'
    ) {
      return status;
    }

    return 'UNKNOWN';
  }

  private normalizeReasons(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const record = item as Record<string, unknown>;
      const message = typeof record['message'] === 'string' ? record['message'].trim() : '';
      if (!message) return [];
      return [{
        code: typeof record['code'] === 'string' ? record['code'] : null,
        field: typeof record['field'] === 'string' ? record['field'] : null,
        message,
      }];
    });
  }

  private normalizeMissingFacts(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const record = item as Record<string, unknown>;
      const key = typeof record['key'] === 'string'
        ? record['key']
        : typeof record['field'] === 'string'
          ? record['field']
          : '';
      const message = typeof record['message'] === 'string' ? record['message'].trim() : '';
      if (!message) return [];
      return [{ key, message }];
    });
  }

  private normalizeGuidanceItems(value: unknown) {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
      if (typeof item === 'string' && item.trim()) {
        return [{ title: item.trim() }];
      }
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        const title = typeof record['title'] === 'string' ? record['title'].trim() : '';
        if (!title) return [];
        return [{ title, ...(typeof record['url'] === 'string' ? { url: record['url'] } : {}) }];
      }
      return [];
    });
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
