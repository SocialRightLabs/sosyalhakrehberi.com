import { Routes } from '@angular/router';
import { EligibilityCatalogComponent } from './features/eligibility/eligibility-catalog.component';
import { EligibilityTesterComponent } from './features/eligibility/eligibility-tester.component';
import { BenefitTestPageComponent } from './features/eligibility/benefit-test-page.component';

export const routes: Routes = [
  { path: '', component: EligibilityCatalogComponent },
  { path: 'evde-bakim', component: EligibilityTesterComponent },
  { path: 'dogum-yardimi', component: BenefitTestPageComponent, data: { testKey: 'TR_BIRTH_GRANT' } },
  { path: 'engelli-maasi', component: BenefitTestPageComponent, data: { testKey: 'TR_DISABILITY_PENSION' } },
  { path: 'gss', component: BenefitTestPageComponent, data: { testKey: 'TR_GSS' } },
  { path: '65-yas-ayligi', component: BenefitTestPageComponent, data: { testKey: 'TR_OLD_AGE_PENSION' } },
];
