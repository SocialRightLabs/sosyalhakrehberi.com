import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PlatformMetricsSnapshot } from './platform-metrics.types';

const VISITOR_STORAGE_KEY = 'socialright_platform_visitor_key';
const VISIT_SENT_KEY = 'socialright_platform_visit_sent';

@Injectable({
  providedIn: 'root',
})
export class PlatformMetricsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  readonly stats = signal<PlatformMetricsSnapshot | null>(null);
  readonly loading = signal(false);

  readonly totalVisitors = computed(() => this.stats()?.total_visitors ?? 0);
  readonly totalTestUses = computed(() => this.stats()?.total_test_uses ?? 0);

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  async loadStats(): Promise<PlatformMetricsSnapshot | null> {
    try {
      this.loading.set(true);
      const response = await firstValueFrom(
        this.http.get<PlatformMetricsSnapshot>(`${this.baseUrl}/api/v1/platform/stats`, {
          headers: this.headers,
        }),
      );
      this.stats.set(this.normalizeSnapshot(response));
      return this.stats();
    } catch {
      return this.stats();
    } finally {
      this.loading.set(false);
    }
  }

  async recordVisit(): Promise<void> {
    const visitorKey = this.ensureVisitorKey();

    if (this.hasVisitBeenTracked()) {
      await this.loadStats();
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/api/v1/platform/visit`,
          { visitor_key: visitorKey },
          { headers: this.headers },
        ),
      );
      this.markVisitTracked();
    } catch {
      // ziyaret akışı canlı deneyimi bozmasın
    } finally {
      await this.loadStats();
    }
  }

  private normalizeSnapshot(value: unknown): PlatformMetricsSnapshot {
    const data = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

    return {
      total_visitors: this.toNumber(data['total_visitors']),
      total_test_uses: this.toNumber(data['total_test_uses']),
      tests: Array.isArray(data['tests'])
        ? data['tests'].flatMap((item) => {
            if (!item || typeof item !== 'object') return [];
            const record = item as Record<string, unknown>;
            const benefitCode = typeof record['benefit_code'] === 'string' ? record['benefit_code'] : '';
            const label = typeof record['label'] === 'string' ? record['label'] : benefitCode;
            if (!benefitCode || !label) return [];
            return [
              {
                benefit_code: benefitCode,
                label,
                usage_count: this.toNumber(record['usage_count']),
              },
            ];
          })
        : [],
      updated_at: typeof data['updated_at'] === 'string' && data['updated_at'].trim() !== '' ? data['updated_at'] : null,
    };
  }

  private ensureVisitorKey(): string {
    if (typeof window === 'undefined') {
      return 'server';
    }

    const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (existing && existing.trim() !== '') {
      return existing;
    }

    const created = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    window.localStorage.setItem(VISITOR_STORAGE_KEY, created);
    return created;
  }

  private hasVisitBeenTracked(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(VISIT_SENT_KEY) === '1';
  }

  private markVisitTracked(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(VISIT_SENT_KEY, '1');
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
