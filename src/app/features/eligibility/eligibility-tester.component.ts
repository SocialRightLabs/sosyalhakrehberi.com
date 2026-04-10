import { ChangeDetectionStrategy, Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Api } from '../../services/api';
import { EligibilityFormService } from './eligibility-form.service';
import { EligibilityStepperComponent } from './eligibility-stepper.component';
import { EligibilityCheckResult, EligibilityStatus, GuidanceItem, ReasonItem, MissingFactItem } from './eligibility.types';
import { ResultCardComponent } from './result-card.component';
import { ExplanationPanelComponent, EligibilityTransparencyDetails } from './explanation-panel.component';

@Component({
  standalone: true,
  selector: 'app-eligibility-tester',
  imports: [ReactiveFormsModule, EligibilityStepperComponent, ResultCardComponent, ExplanationPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './eligibility-tester.component.html',
  styleUrl: './eligibility-tester.component.scss',
})
export class EligibilityTesterComponent {
  private readonly api = inject(Api);
  readonly formService = inject(EligibilityFormService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentStep = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<EligibilityCheckResult | null>(null);
  readonly details = signal<EligibilityTransparencyDetails | null>(null);

  // HTML'de app-result-card'a bağlamak için eklendi
  readonly benefitType = 'TR_HOME_CARE_ALLOWANCE';

  readonly currentStepConfig = computed(() => this.formService.steps[this.currentStep()] ?? this.formService.steps[0]);

  nextStep(): void {
    if (this.currentStep() < this.formService.steps.length - 1) {
      this.currentStep.update((value) => value + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((value) => value - 1);
    }
  }

  selectStep(index: number): void {
    if (index >= 0 && index < this.formService.steps.length) {
      this.currentStep.set(index);
    }
  }

  submit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.details.set(null);

    const request = this.formService.buildEvaluationRequest();

    this.api
      .evaluateBenefit(request)
      .then(async (response) => {
        const result = this.normalizeResult(response);
        this.result.set(result);

        if (result.decision_id) {
          this.details.set(await this.loadTransparency(result.decision_id, result));
        }
      })
      .catch((error: unknown) => {
        this.error.set(this.api.normalizeError(error));
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  resetFlow(): void {
    this.formService.reset();
    this.currentStep.set(0);
    this.result.set(null);
    this.details.set(null);
    this.error.set(null);
    this.loading.set(false);
  }

  private normalizeResult(response: unknown): EligibilityCheckResult {
    const data = response && typeof response === 'object' ? (response as Record<string, unknown>) : {};
    const status = this.normalizeStatus(data['status'] ?? data['outcome']);

    return {
      status,
      reasons: this.normalizeReasons(data['reasons']),
      missing_facts: this.normalizeMissingFacts(data['missing_facts']),
      user_message: typeof data['user_message'] === 'string' ? data['user_message'] : null,
      disclaimer: typeof data['disclaimer'] === 'string' ? data['disclaimer'] : null,
      guidance_items: this.normalizeGuidanceItems(data['guidance_items']),
    };
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

  private normalizeReasons(value: unknown): ReasonItem[] {
    if (!Array.isArray(value)) {
      return [];
    }

    const reasons: ReasonItem[] = [];

    for (const item of value) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const record = item as Record<string, unknown>;
      const message = typeof record['message'] === 'string' ? record['message'].trim() : '';

      if (!message) {
        continue;
      }

      reasons.push({
        code: typeof record['code'] === 'string' ? record['code'] : null,
        field: typeof record['field'] === 'string' ? record['field'] : null,
        message,
      });
    }

    return reasons;
  }

  private normalizeMissingFacts(value: unknown): MissingFactItem[] {
    if (!Array.isArray(value)) {
      return [];
    }

    const facts: MissingFactItem[] = [];

    for (const item of value) {
      if (!item || typeof item !== 'object') {
        continue;
      }

      const record = item as Record<string, unknown>;
      const message = typeof record['message'] === 'string' ? record['message'].trim() : '';
      const key =
        typeof record['key'] === 'string'
          ? record['key']
          : typeof record['field'] === 'string'
            ? record['field']
            : '';

      if (!message) {
        continue;
      }

      facts.push({ key, message });
    }

    return facts;
  }

  private normalizeGuidanceItems(value: unknown): GuidanceItem[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item): GuidanceItem | null => {
        if (typeof item === 'string' && item.trim().length > 0) {
          return { title: item.trim() };
        }
        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const title = typeof record['title'] === 'string' ? record['title'].trim() : '';
          if (!title) return null;
          return {
            title,
            ...(typeof record['url'] === 'string' ? { url: record['url'] } : {}),
          };
        }
        return null;
      })
      .filter((item): item is GuidanceItem => item !== null);
  }

  private async loadTransparency(decisionId: string, result: EligibilityCheckResult): Promise<EligibilityTransparencyDetails | null> {
    try {
      const [explain, trace] = await Promise.all([
        this.api.explainDecision(decisionId),
        this.api.traceDecision(decisionId),
      ]);

      const legalBasis = explain.explanations
        .map((item) => [item.law_reference, item.article, item.description].filter((value): value is string => typeof value === 'string' && value.trim() !== '').join(' - '))
        .filter((item) => item.trim() !== '');

      return {
        explanations: explain.explanations,
        traceEvaluations: trace.rule_evaluations,
        legalBasis: Array.from(new Set(legalBasis)),
        thresholdsUsed: trace.rule_evaluations.map((item) => ({
          rule_code: item.rule_code,
          value: item.value,
          threshold: item.threshold,
        })),
        ruleVersion: this.resolveRuleVersion(result),
        evaluatedAt: trace.created_at ?? trace.rule_evaluations.find((item) => item.evaluated_at)?.evaluated_at ?? result.evaluated_at ?? null,
      };
    } catch {
      return null;
    }
  }

  private resolveRuleVersion(result: EligibilityCheckResult): string | null {
    const metadata = result.metadata;
    if (metadata && typeof metadata === 'object') {
      const version = metadata['policy_version'];
      if (typeof version === 'string' && version.trim() !== '') {
        return version.trim();
      }
    }

    return result.rule_version ?? null;
  }
}
