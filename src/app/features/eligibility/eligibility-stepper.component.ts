import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { EligibilityStep } from './eligibility.types';

@Component({
  selector: 'app-eligibility-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './eligibility-stepper.component.html',
  styleUrl: './eligibility-stepper.component.scss',
})
export class EligibilityStepperComponent {
  @Input({ required: true }) steps: EligibilityStep[] = [];
  @Input({ required: true }) currentStep = 0;
  @Output() stepSelected = new EventEmitter<number>();

  get progress(): number {
    return this.steps.length === 0 ? 0 : ((this.currentStep + 1) / this.steps.length) * 100;
  }
}
