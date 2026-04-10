import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { EvaluationRequest } from '../features/eligibility/eligibility.types';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  async evaluateBenefit(request: EvaluationRequest): Promise<unknown> {
    const payload = {
      benefit_code: request.benefit_code,
      facts: request.facts,
      context: {
        jurisdiction: request.context?.jurisdiction ?? 'TR',
        request_id: request.context?.request_id ?? `web_${Date.now()}`,
      },
    };
    return firstValueFrom(
      this.http.post(`${this.baseUrl}/api/v1/check`, payload, { headers: this.headers }),
    );
  }

  normalizeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error === 'object' && 'message' in error.error) {
        const message = (error.error as { message?: string }).message;
        if (message) return message;
      }
      if (typeof error.message === 'string' && error.message.trim()) return error.message;
    }
    return 'İstek başarısız oldu. Lütfen tekrar deneyin.';
  }
}
