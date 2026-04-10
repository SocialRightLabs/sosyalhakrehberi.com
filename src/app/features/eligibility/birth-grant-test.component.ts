import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { EligibilityCheckResult, ReasonItem, MissingFactItem, GuidanceItem, EligibilityStatus } from './eligibility.types';
import { ResultCardComponent } from './result-card.component';

@Component({
  selector: 'app-birth-grant-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ResultCardComponent],
  templateUrl: './birth-grant-test.component.html',
})
export class BirthGrantTestComponent {
  private fb = inject(FormBuilder);
  private api = inject(Api);

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  result = signal<EligibilityCheckResult | null>(null);

  testForm: FormGroup = this.fb.group({
    child_is_live_birth: [null, [Validators.required]],
    child_birth_date: [''],
    previous_live_children_count: ['', [Validators.required]],
    applicant_is_turkish_citizen: [null, [Validators.required]],
    applicant_resides_in_tr: [null],
    child_resides_in_tr: [null],
    child_is_kps_registered: [null, [Validators.required]],
    child_is_alive: [null],
  });

  onSubmit(): void {
    if (this.testForm.invalid) {
      this.error.set('Lütfen eksik alanları doldurun. Kanuni değerlendirme için ekrandaki bilgiler zorunludur.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.result.set(null);

    const facts = this.cleanFacts(this.testForm.value);

    this.api
      .evaluateBenefit({
        benefit_code: 'TR_BIRTH_GRANT',
        facts,
        context: { jurisdiction: 'TR', request_id: `web_bg_${Date.now()}` },
      })
      .then((response) => {
        this.result.set(this.normalizeResult(response));
      })
      .catch((err: unknown) => {
        this.error.set(this.api.normalizeError(err));
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  resetTest(): void {
    this.testForm.reset();
    this.result.set(null);
    this.error.set(null);
  }

  private cleanFacts(formValue: Record<string, unknown>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== '') {
        cleaned[key] = formValue[key];
      }
    }
    return cleaned;
  }

  private normalizeResult(response: unknown): EligibilityCheckResult {
    const data = response && typeof response === 'object' ? (response as Record<string, unknown>) : {};
    const rawStatus = String(data['status'] ?? '').toUpperCase();
    const validStatuses: EligibilityStatus[] = ['ELIGIBLE', 'NOT_ELIGIBLE', 'NEEDS_INFO', 'MANUAL_REVIEW', 'LEGAL_CONFLICT'];
    const status: EligibilityStatus = (validStatuses as string[]).includes(rawStatus)
      ? (rawStatus as EligibilityStatus)
      : 'UNKNOWN';

    const reasons: ReasonItem[] = Array.isArray(data['reasons'])
      ? (data['reasons'] as unknown[]).flatMap((r) => {
          if (!r || typeof r !== 'object') return [];
          const rec = r as Record<string, unknown>;
          const message = typeof rec['message'] === 'string' ? rec['message'].trim() : '';
          return message ? [{ code: typeof rec['code'] === 'string' ? rec['code'] : null, field: null, message }] : [];
        })
      : [];

    const missing_facts: MissingFactItem[] = Array.isArray(data['missing_facts'])
      ? (data['missing_facts'] as unknown[]).flatMap((f) => {
          if (!f || typeof f !== 'object') return [];
          const rec = f as Record<string, unknown>;
          const key = typeof rec['key'] === 'string' ? rec['key'] : '';
          const message = typeof rec['message'] === 'string' ? rec['message'].trim() : '';
          return message ? [{ key, message }] : [];
        })
      : [];

    const guidance_items: GuidanceItem[] = Array.isArray(data['guidance_items'])
      ? (data['guidance_items'] as unknown[]).flatMap((g) => {
          if (typeof g === 'string' && g.trim()) return [{ title: g.trim() }];
          if (g && typeof g === 'object') {
            const rec = g as Record<string, unknown>;
            const title = typeof rec['title'] === 'string' ? rec['title'].trim() : '';
            return title ? [{ title, ...(typeof rec['url'] === 'string' ? { url: rec['url'] } : {}) }] : [];
          }
          return [];
        })
      : [];

    return {
      status,
      reasons,
      missing_facts,
      guidance_items,
      user_message: typeof data['user_message'] === 'string' ? data['user_message'] : null,
      disclaimer: typeof data['disclaimer'] === 'string' ? data['disclaimer'] : null,
    };
  }
}
