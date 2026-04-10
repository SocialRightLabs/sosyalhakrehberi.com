import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EligibilityCheckResult, EligibilityStatus } from './eligibility.types';
import { ActionRoadmapComponent } from './action-roadmap.component';
import { CommonModule } from '@angular/common';
import { ROADMAP_DATA } from './content/guidance-roadmap.data';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [CommonModule, ActionRoadmapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './result-card.component.html',
  styleUrl: './result-card.component.scss',
})
export class ResultCardComponent {
  @Input() result: EligibilityCheckResult | null = null;
  @Input() benefitType?: string; // Hangi teste ait rehberi göstereceğimizi bilmek için

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
        return 'Eksik Bilgi Gerekli';
      case 'review':
        return 'Uzman İncelemesi Gerekli';
      default:
        return 'Değerlendirme Sonucu';
    }
  }

  message(): string {
    const benefitName = this.benefitName();

    switch (this.mapStatus(this.result?.status)) {
      case 'eligible':
        return benefitName ? `${benefitName} için başvuru yapabilirsiniz.` : 'Başvuru yapabilirsiniz.';
      case 'negative':
        return benefitName ? `Mevcut bilgilerle ${benefitName} için uygun görünmüyorsunuz.` : 'Mevcut bilgilerle uygun görünmüyorsunuz.';
      case 'needs-info':
        return 'Karar için aşağıdaki bilgileri tamamlayın.';
      case 'review':
        return 'Durumunuz uzman incelemesi gerektiriyor.';
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
        return 'Uygun';
      case 'negative':
        return 'Uygun değil';
      case 'needs-info':
        return 'Eksik bilgi';
      case 'review':
        return 'İnceleme';
      default:
        return 'Beklemede';
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

  private benefitName(): string | null {
    if (!this.benefitType) {
      return null;
    }

    const roadmap = ROADMAP_DATA[this.benefitType];
    return roadmap?.title ?? null;
  }
}
