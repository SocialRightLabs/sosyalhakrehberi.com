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
      title: 'Karar motoru',
      description: 'Kurum mantığını backend’de tutan deterministic değerlendirme akışı.',
    },
    {
      title: 'Açıklanabilirlik',
      description: 'Gerekçeler, eşikler, mevzuat dayanağı ve tarih damgası birlikte sunulur.',
    },
    {
      title: 'Eksik veri dostu',
      description: 'Boş alanlar engel olmaz; sistem NEEDS_INFO ile kullanıcıyı yönlendirir.',
    },
  ];

  readonly quickStats = [
    { value: '5', label: 'Canlı test' },
    { value: '100%', label: 'Boş alan toleransı' },
    { value: '1', label: 'Kanonik karar hattı' },
  ];
}
