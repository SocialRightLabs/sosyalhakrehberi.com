import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PlatformMetricsSnapshot } from './platform-metrics.types';

@Component({
  standalone: true,
  selector: 'app-platform-stats-strip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur" [class.border-slate-200]="light" [class.bg-white]="light">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em]" [class.text-white/70]="!light" [class.text-slate-500]="light">Toplam ziyaretçi</p>
        <p class="mt-2 text-2xl font-extrabold" [class.text-white]="!light" [class.text-ink-900]="light">{{ visitorCount() }}</p>
        <p class="mt-1 text-xs leading-5" [class.text-white/65]="!light" [class.text-slate-500]="light">Platforma gelen toplam ziyaretçi sayısı</p>
      </div>

      <div class="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur" [class.border-slate-200]="light" [class.bg-white]="light">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em]" [class.text-white/70]="!light" [class.text-slate-500]="light">Toplam test kullanımı</p>
        <p class="mt-2 text-2xl font-extrabold" [class.text-white]="!light" [class.text-ink-900]="light">{{ usageCount() }}</p>
        <p class="mt-1 text-xs leading-5" [class.text-white/65]="!light" [class.text-slate-500]="light">Tüm uygunluk testlerinin toplu kullanım sayısı</p>
      </div>

      <div class="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur" [class.border-slate-200]="light" [class.bg-white]="light">
        <p class="text-[11px] font-bold uppercase tracking-[0.22em]" [class.text-white/70]="!light" [class.text-slate-500]="light">{{ title }}</p>
        <p class="mt-2 text-2xl font-extrabold" [class.text-white]="!light" [class.text-ink-900]="light">{{ currentCount() }}</p>
        <p class="mt-1 text-xs leading-5" [class.text-white/65]="!light" [class.text-slate-500]="light">Seçili hizmetin canlı kullanım sayısı</p>
      </div>
    </div>
  `,
})
export class PlatformStatsStripComponent {
  @Input({ required: true }) stats: PlatformMetricsSnapshot | null = null;
  @Input() benefitCode: string | null = null;
  @Input() title = 'Bu hizmet';
  @Input() light = false;

  visitorCount(): string {
    return this.formatCount(this.stats?.total_visitors ?? 0);
  }

  usageCount(): string {
    return this.formatCount(this.stats?.total_test_uses ?? 0);
  }

  currentCount(): string {
    const test = this.stats?.tests?.find((item) => item.benefit_code === this.benefitCode);
    return this.formatCount(test?.usage_count ?? 0);
  }

  private formatCount(value: number): string {
    return new Intl.NumberFormat('tr-TR').format(Number.isFinite(value) ? value : 0);
  }
}
