import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TEST_CATALOG } from './benefit-test.config';
import { PlatformMetricsService } from './platform-metrics.service';
import { PlatformStatsStripComponent } from './platform-stats-strip.component';

@Component({
  standalone: true,
  selector: 'app-eligibility-catalog',
  imports: [RouterLink, PlatformStatsStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './eligibility-catalog.component.html',
  styleUrl: './eligibility-catalog.component.scss',
})
export class EligibilityCatalogComponent implements OnInit {
  private readonly platformMetrics = inject(PlatformMetricsService);

  readonly tests = TEST_CATALOG;
  readonly platformPillars = [
    {
      title: 'Hak arama kültürü',
      description: 'Vatandaşın hangi desteğe yaklaşabildiğini sade, saygılı ve yönlendirici bir dille anlatır.',
    },
    {
      title: 'Kurum dili anlaşılır hale gelir',
      description: 'Resmi süreçleri insanın anlayacağı dile çevirir; eksik bilgi yüzünden kimse dışarıda kalmaz.',
    },
    {
      title: 'Toplumsal bilinç üretir',
      description: 'Sadece sonuç vermez, nasıl başvurulacağını ve hangi belgeye ihtiyaç olduğunu öğretir.',
    },
  ];

  readonly quickStats = [
    { value: '5', label: 'Canlı hak testi' },
    { value: '100%', label: 'Eksik bilgi toleransı' },
    { value: '1', label: 'Açıklanabilir karar hattı' },
  ];

  ngOnInit(): void {
    void this.platformMetrics.recordVisit();
  }

  get stats() {
    return this.platformMetrics.stats();
  }

  usageCount(benefitCode: string): number {
    return this.stats?.tests?.find((item) => item.benefit_code === benefitCode)?.usage_count ?? 0;
  }

  formatCount(value: number): string {
    return new Intl.NumberFormat('tr-TR').format(Number.isFinite(value) ? value : 0);
  }
}
