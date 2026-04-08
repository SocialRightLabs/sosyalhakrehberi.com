import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EligibilityCheckResult, EligibilityStatus } from './eligibility.types';

@Component({
  selector: 'app-result-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
})
export class ResultCardComponent {
  @Input() result: EligibilityCheckResult | null = null;

  tone(): 'eligible' | 'negative' | 'needs-info' | 'review' | 'idle' {
    return this.mapStatus(this.result?.status);
  }

  title(): string {
    switch (this.mapStatus(this.result?.status)) {
      case 'eligible':
        return 'Sonuç: Uygunsunuz';
      case 'negative':
        return 'Sonuç: Uygun Değilsiniz';
      case 'needs-info':
        return 'Eksik Bilgiler';
      case 'review':
        return 'Uzman İncelemesi Gerekli';
      default:
        return 'Değerlendirme Sonucu';
    }
  }

  message(): string {
    switch (this.mapStatus(this.result?.status)) {
      case 'eligible':
        return 'Evde bakım desteğine başvurabilirsiniz.';
      case 'negative':
        return 'Mevcut bilgilerle destek için uygun görünmüyorsunuz.';
      case 'needs-info':
        return 'Lütfen aşağıdaki bilgileri tamamlayın:';
      case 'review':
        return 'Durumunuz uzman tarafından değerlendirilmelidir.';
      default:
        return 'Bilgilerinizi girerek değerlendirmeyi başlatabilirsiniz.';
    }
  }

  hasReasons(): boolean {
    return (this.result?.reasons?.length ?? 0) > 0;
  }

  hasMissingFacts(): boolean {
    return (this.result?.missing_facts?.length ?? 0) > 0;
  }

  badge(): string {
    switch (this.mapStatus(this.result?.status)) {
      case 'eligible':
        return '✓';
      case 'negative':
        return '!';
      case 'needs-info':
        return '?';
      case 'review':
        return '!';
      default:
        return '•';
    }
  }

  private mapStatus(status: EligibilityStatus | undefined): 'eligible' | 'negative' | 'needs-info' | 'review' | 'idle' {
    switch ((status ?? 'UNKNOWN').toUpperCase()) {
      case 'ELIGIBLE':
        return 'eligible';
      case 'NOT_ELIGIBLE':
        return 'negative';
      case 'NEEDS_INFO':
        return 'needs-info';
      case 'MANUAL_REVIEW':
      case 'LEGAL_CONFLICT':
        return 'review';
      default:
        return 'idle';
    }
  }
}
