import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EligibilityStep } from './eligibility.types';

type Nullable<T> = T | null;

export interface EligibilityFormValue {
  is_turkish_citizen: Nullable<boolean>;
  is_resident_in_tr: Nullable<boolean>;
  has_valid_health_report: Nullable<boolean>;
  has_social_security: Nullable<boolean>;
  disability_rate: Nullable<number>;
  household_size: Nullable<number>;
  household_income: Nullable<number>;
  consent_kvkk: Nullable<boolean>;
  consent_terms: Nullable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class EligibilityFormService {
  readonly steps: EligibilityStep[] = [
    {
      key: 'kimlik',
      label: 'Kimlik ve ikamet',
      description: 'Vatandaşlık ve ikamet durumunuzu girin.',
    },
    {
      key: 'saglik',
      label: 'Sağlık bilgileri',
      description: 'Sağlık raporu ve engel oranınızı belirtin.',
    },
    {
      key: 'hane',
      label: 'Hane bilgileri',
      description: 'Hane büyüklüğü, gelir ve sosyal güvence bilgisini ekleyin.',
    },
    {
      key: 'onay',
      label: 'Yasal Onaylar',
      description: 'KVKK ve Kullanım Koşulları onaylarınızı verin.',
    },
  ];

  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      is_turkish_citizen: [null as Nullable<boolean>],
      is_resident_in_tr: [null as Nullable<boolean>],
      has_valid_health_report: [null as Nullable<boolean>],
      has_social_security: [null as Nullable<boolean>],
      disability_rate: [null as Nullable<number>, [Validators.min(0), Validators.max(100)]],
      household_size: [null as Nullable<number>, [Validators.min(1), Validators.max(20)]],
      household_income: [null as Nullable<number>, [Validators.min(0), Validators.max(100000000)]],
      consent_kvkk: [false as Nullable<boolean>, [Validators.requiredTrue]],
      consent_terms: [false as Nullable<boolean>, [Validators.requiredTrue]],
    });
  }

  buildPayload(): Record<string, unknown> {
    const value = this.form.getRawValue() as EligibilityFormValue;

    return {
      benefit_code: 'TR_HOME_CARE_ALLOWANCE',
      facts: {
        is_turkish_citizen: this.asBoolean(value.is_turkish_citizen),
        is_resident_in_tr: this.asBoolean(value.is_resident_in_tr),
        has_valid_health_report: this.asBoolean(value.has_valid_health_report),
        has_social_security: this.asBoolean(value.has_social_security),
        disability_rate: this.asNumber(value.disability_rate),
        household_size: this.asNumber(value.household_size),
        household_income: this.asNumber(value.household_income),
      },
      context: {
        jurisdiction: 'TR',
        request_id: this.requestId(),
      },
    };
  }

  reset(): void {
    this.form.reset({
      is_turkish_citizen: null,
      is_resident_in_tr: null,
      has_valid_health_report: null,
      has_social_security: null,
      disability_rate: null,
      household_size: null,
      household_income: null,
      consent_kvkk: false,
      consent_terms: false,
    });
  }

  private asNumber(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private asBoolean(value: unknown): boolean | null {
    return typeof value === 'boolean' ? value : null;
  }

  private requestId(): string {
    return `web_${Date.now()}`;
  }
}
