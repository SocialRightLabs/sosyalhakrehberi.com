import { Routes } from '@angular/router';
import { EligibilityTesterComponent } from './features/eligibility/eligibility-tester.component';
import { BirthGrantTestComponent } from './features/eligibility/birth-grant-test.component';

export const routes: Routes = [
  { path: '', component: EligibilityTesterComponent },
  { path: 'dogum-yardimi', component: BirthGrantTestComponent },
];
