import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

type EligibilityResponse = {
  status?: string;
  request_id?: string;
  decision_id?: string;
  reason?: string;
  message?: string;
};

@Component({
  standalone: true,
  selector: 'app-eligibility-tester',
  imports: [CommonModule, FormsModule],
  template: `
    <main class="shell">
      <section class="card">
        <p class="eyebrow">Sosyal Hak Rehberi</p>
        <h1>Eligibility Tester</h1>
        <p class="subtitle">Frontend renders, backend decides.</p>
        <div class="support-row">
          <a href="https://sosyalhakrehberi.com" target="_blank" rel="noopener">Website</a>
          <a href="https://github.com/sponsors/SocialRightLabs" target="_blank" rel="noopener">Support</a>
          <a href="mailto:info@sosyalhizmetdanismani.com">Contact</a>
        </div>

        <div class="position-box">
          <strong>Public value</strong>
          <p>Understand social-rights eligibility, reduce failed applications, and keep the decision logic in SocialRightOS.</p>
        </div>

        <label>
          Benefit code
          <input [(ngModel)]="benefitCode" name="benefitCode" />
        </label>

        <label>
          Household income
          <input [(ngModel)]="householdIncome" name="householdIncome" type="number" />
        </label>

        <label>
          Household size
          <input [(ngModel)]="householdSize" name="householdSize" type="number" />
        </label>

        <label>
          Disability rate
          <input [(ngModel)]="disabilityRate" name="disabilityRate" type="number" />
        </label>

        <button type="button" (click)="submit()" [disabled]="loading()">
          {{ loading() ? 'Sending...' : 'Check Eligibility' }}
        </button>

        <p class="error" *ngIf="error()">{{ error() }}</p>
        <pre class="result" *ngIf="result()">{{ result() | json }}</pre>

        <div class="mission-box">
          <strong>Mission</strong>
          <p>Make social-rights guidance understandable, auditable, and API-driven.</p>
        </div>

        <div class="mission-box">
          <strong>Support this project</strong>
          <p>Support helps maintain the platform, keep access low-cost, and expand guidance to more users.</p>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: linear-gradient(180deg, #0f172a 0%, #111827 100%); color: #e5e7eb; }
    .shell { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    .card { width: min(720px, 100%); background: rgba(17, 24, 39, 0.85); border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 24px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    .eyebrow { text-transform: uppercase; letter-spacing: .18em; font-size: 12px; color: #94a3b8; }
    h1 { margin: 8px 0 4px; font-size: 34px; }
    .subtitle { margin: 0 0 24px; color: #cbd5e1; }
    .support-row { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
    .support-row a { color: #93c5fd; text-decoration: none; font-size: 14px; }
    .position-box { margin-bottom: 18px; padding: 16px; border-radius: 14px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.16); }
    .position-box p { margin: 6px 0 0; color: #cbd5e1; }
    label { display: grid; gap: 8px; margin-bottom: 16px; color: #cbd5e1; font-size: 14px; }
    input { background: #0f172a; color: #f8fafc; border: 1px solid rgba(148, 163, 184, 0.24); border-radius: 12px; padding: 14px 16px; font-size: 16px; }
    button { width: 100%; margin-top: 8px; border: 0; border-radius: 12px; padding: 14px 16px; background: #22c55e; color: #052e16; font-weight: 700; cursor: pointer; }
    button:disabled { opacity: .7; cursor: wait; }
    .error { margin-top: 16px; color: #fca5a5; }
    .result { margin-top: 16px; padding: 16px; background: #020617; border-radius: 12px; overflow: auto; }
    .mission-box { margin-top: 18px; padding: 16px; border-radius: 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.16); }
    .mission-box p { margin: 6px 0 0; color: #cbd5e1; }
  `],
})
export class EligibilityTesterComponent {
  private readonly api = inject(Api);

  loading = signal(false);
  error = signal('');
  result = signal<EligibilityResponse | null>(null);

  benefitCode = 'TR_HOME_CARE_ALLOWANCE';
  householdIncome = 10000;
  householdSize = 4;
  disabilityRate = 80;

  async submit(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    const payload = {
      benefit_code: this.benefitCode,
      facts: {
        household_income: Number(this.householdIncome),
        household_size: Number(this.householdSize),
        disability_rate: Number(this.disabilityRate),
      },
      context: {
        jurisdiction: 'TR',
        request_id: `web_${Date.now()}`,
      },
    };

    try {
      const response = (await this.api.checkEligibility(payload)) as EligibilityResponse;
      this.result.set(response);
    } catch (error) {
      this.error.set(this.api.normalizeError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
