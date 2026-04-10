import { ChangeDetectionStrategy, Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Api } from '../../services/api';
import { EligibilityFormService } from './eligibility-form.service';
import { EligibilityStepperComponent } from './eligibility-stepper.component';
import { EligibilityCheckResult, EligibilityStatus, GuidanceItem, ReasonItem, MissingFactItem } from './eligibility.types';
import { ResultCardComponent } from './result-card.component';

@Component({
  standalone: true,
  selector: 'app-eligibility-tester',
  imports: [ReactiveFormsModule, EligibilityStepperComponent, ResultCardComponent],
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

    const request = this.formService.buildEvaluationRequest();

    this.api
      .evaluateBenefit(request)
      .then((response) => {
        this.result.set(this.normalizeResult(response));
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
}
