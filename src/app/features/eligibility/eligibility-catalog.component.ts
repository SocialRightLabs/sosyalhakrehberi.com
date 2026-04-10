import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TEST_CATALOG } from './benefit-test.config';

@Component({
  standalone: true,
  selector: 'app-eligibility-catalog',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './eligibility-catalog.component.html',
  styleUrl: './eligibility-catalog.component.scss',
})
export class EligibilityCatalogComponent {
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
}
