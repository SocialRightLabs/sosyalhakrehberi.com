import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  async checkEligibility(payload: unknown): Promise<unknown> {
    return firstValueFrom(
      this.http.post(`${this.baseUrl}/api/v1/check`, payload, {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }),
    );
  }

  normalizeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error === 'object' && 'message' in error.error) {
        const message = (error.error as { message?: string }).message;
        if (message) {
          return message;
        }
      }

      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }
    }

    return 'İstek başarısız oldu. Lütfen tekrar deneyin.';
  }
}
