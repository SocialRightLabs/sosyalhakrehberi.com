import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DecisionExplainabilityItem, DecisionTraceItem, EligibilityCheckResult } from './eligibility.types';

export interface EligibilityTransparencyDetails {
  explanations: DecisionExplainabilityItem[];
  traceEvaluations: DecisionTraceItem[];
  legalBasis: string[];
  thresholdsUsed: Array<{ rule_code: string; value?: unknown; threshold?: unknown }>;
  ruleVersion: string | null;
  evaluatedAt: string | null;
}

@Component({
  standalone: true,
  selector: 'app-explanation-panel',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explanation-panel.component.html',
  styleUrl: './explanation-panel.component.scss',
})
export class ExplanationPanelComponent {
  @Input() result: EligibilityCheckResult | null = null;
  @Input() details: EligibilityTransparencyDetails | null = null;

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
