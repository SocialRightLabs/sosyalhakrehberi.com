import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  
  /**
   * Kullanıcı etkileşimlerini takip eder. PII (Kişisel Veri) GÖNDERİLMEZ.
   * @param eventName Olayın adı (örn: 'roadmap_viewed')
   * @param properties Olayla ilgili ek detaylar (örn: { benefit_type: 'TR_BIRTH_GRANT' })
   */
  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    // Geliştirme ortamında (localhost) asıl sunucuya veri atmak yerine konsola yazdır
    if (isDevMode()) {
      console.log(`[Analytics MOCK] Event: ${eventName}`, properties);
      return;
    }

    try {
      // PostHog Entegrasyonu (Eğer window.posthog yüklüyse)
      (window as any).posthog?.capture(eventName, properties);
      
      // Google Analytics Entegrasyonu (Eğer window.gtag yüklüyse)
      (window as any).gtag?.('event', eventName, properties);
    } catch (e) {
      console.error('Analytics tracking failed', e);
    }
  }
}