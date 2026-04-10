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
}
