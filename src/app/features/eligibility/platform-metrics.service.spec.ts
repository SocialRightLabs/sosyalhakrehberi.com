import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { PlatformMetricsService } from './platform-metrics.service';

describe('PlatformMetricsService', () => {
  let service: PlatformMetricsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(PlatformMetricsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads platform stats from the API', async () => {
    const promise = service.loadStats();

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/api/v1/platform/stats`);
    expect(request.request.method).toBe('GET');

    request.flush({
      total_visitors: 12,
      total_test_uses: 34,
      tests: [
        { benefit_code: 'TR_HOME_CARE_ALLOWANCE', label: 'Evde Bakım', usage_count: 7 },
      ],
      updated_at: '2026-04-10T00:00:00Z',
    });

    const stats = await promise;

    expect(stats?.total_visitors).toBe(12);
    expect(stats?.total_test_uses).toBe(34);
    expect(stats?.tests[0].benefit_code).toBe('TR_HOME_CARE_ALLOWANCE');
  });
});
