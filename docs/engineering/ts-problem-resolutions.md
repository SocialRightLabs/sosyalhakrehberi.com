# Frontend TypeScript Problem Kayıtları ve Çözüm Yolları

Bu dosya, IDE Problems panelinde tespit edilen TypeScript derleme hatalarını ve uygulanan çözümleri belgeler.

---

## 2026-04-10 — 15 TypeScript Hatası: Angular Eligibility Feature

### Kapsam

`frontend-angular/src/app/features/eligibility/` klasöründeki 4 bileşen ve 1 tip dosyasında toplam 15 hata tespit edildi.

---

### Hata Grubu 1 — Eksik Modül İmportları (2 hata)

**Dosya:** `action-roadmap.component.ts` — Ln 3-4

```
Cannot find module './content/guidance-roadmap.data' or its corresponding type declarations. ts(2307)
Cannot find module '../../core/services/analytics.service' or its corresponding type declarations. ts(2307)
```

**Kök neden:**
- `content/guidance-roadmap.data.ts` dosyası hiç oluşturulmamıştı.
- `AnalyticsService` aynı klasörde (`analytics.service.ts`) bulunmasına rağmen yanlış core path'e import ediliyordu.

**Çözüm:**
1. `content/guidance-roadmap.data.ts` dosyası oluşturuldu (`GuidanceRoadmap`, `RoadmapStep`, `RoadmapDocument` interface'leri + 4 benefit için `ROADMAP_DATA` sabit verisi).
2. Import yolu düzeltildi:
```ts
// Öncesi
import { AnalyticsService } from '../../core/services/analytics.service';
// Sonrası
import { AnalyticsService } from './analytics.service';
```

---

### Hata Grubu 2 — Signal Bağlamı Dışında `computed()` + `unknown` Tip (4 hata)

**Dosya:** `action-roadmap.component.ts` — Ln 60, 64, 74, 81

```
Object is of type 'unknown'. ts(2571) [Ln 64, Col 7]
Parameter 's' implicitly has an 'any' type. ts(7006) [Ln 74, Col 19]
Parameter 'i' implicitly has an 'any' type. ts(7006) [Ln 74, Col 22]
Object is of type 'unknown'. ts(2571) [Ln 81, Col 7]
```

**Kök neden:**
- `roadmap = computed(() => ROADMAP_DATA[this.benefitType])` — `computed()` Angular signal bağlamı gerektirir; `@Input()` normal property olduğu için signal reaktivitesi yoktu. TypeScript dönüş tipini `unknown` olarak çıkarsıyordu.
- `data.steps.map((s, i) => ...)` — parametreler tip bildirimi olmadığından `any`/`unknown` sayılıyordu.

**Çözüm:**
- `computed()` kaldırılıp getter'a çevrildi:
```ts
// Öncesi
roadmap = computed(() => ROADMAP_DATA[this.benefitType] || null);

// Sonrası
get roadmap(): GuidanceRoadmap | null {
  return ROADMAP_DATA[this.benefitType] ?? null;
}
```
- Template `roadmap() as data` → `roadmap as data` güncellendi.
- `map` parametrelerine açık tip eklendi:
```ts
data.steps.map((s: { title: string; description: string }, i: number) => ...)
```

---

### Hata Grubu 3 — Eksik `EligibilityStep` Export (1 hata)

**Dosya:** `eligibility-form.service.ts` — Ln 4

```
'"./eligibility.types"' has no exported member named 'EligibilityStep'. ts(2724)
```

**Kök neden:** `eligibility-form.service.ts` `EligibilityStep` tipini import ediyordu ancak `eligibility.types.ts` bu interface'i export etmiyordu.

**Çözüm:** `eligibility.types.ts` dosyasına interface eklendi:
```ts
export interface EligibilityStep {
  key: string;
  label: string;
  description: string;
}
```

---

### Hata Grubu 4 — `null` vs `undefined` Tip Uyuşmazlığı (2 hata)

**Dosya:** `eligibility-tester.component.ts` — Ln 91-92

```
Type 'string | null' is not assignable to type 'string | undefined'. ts(2322)
  → user_message (eligibility.types.ts Ln 16)
Type 'string | null' is not assignable to type 'string | undefined'. ts(2322)
  → disclaimer (eligibility.types.ts Ln 17)
```

**Kök neden:** Tester `null` atıyordu ancak `EligibilityCheckResult` interface'inde bu alanlar `string | undefined` (opsiyonel) olarak tanımlıydı.

**Çözüm:** `eligibility.types.ts` interface güncellendi:
```ts
// Öncesi
user_message?: string;
disclaimer?: string;

// Sonrası
user_message?: string | null;
disclaimer?: string | null;
```

---

### Hata Grubu 5 — `string[]` → `GuidanceItem[]` Tip Uyuşmazlığı (1 hata)

**Dosya:** `eligibility-tester.component.ts` — Ln 93

```
Type 'string[]' is not assignable to type 'GuidanceItem[]'. ts(2322)
  → guidance_items (eligibility.types.ts Ln 13)
```

**Kök neden:** Tester `normalizeStrings()` ile `string[]` döndürüyordu ancak `EligibilityCheckResult.guidance_items` tipi `GuidanceItem[]`'dı. Aynı zamanda `GuidanceItem.url` zorunluydu.

**Çözüm:**
- `GuidanceItem.url` optional yapıldı:
```ts
export interface GuidanceItem {
  url?: string;
  title: string;
}
```
- `normalizeStrings()` → `normalizeGuidanceItems()` metoduna dönüştürüldü; hem `string` hem `{title, url}` obje girişlerini `GuidanceItem[]` olarak normalize eder.

---

### Hata Grubu 6 — `'UNKNOWN'` EligibilityStatus Değil (1 hata)

**Dosya:** `eligibility-tester.component.ts` — Ln 110

```
Type '"UNKNOWN"' is not assignable to type 'EligibilityStatus'. ts(2322)
```

**Kök neden:** `normalizeStatus()` bilinmeyen durumlar için `'UNKNOWN'` döndürüyordu ancak `EligibilityStatus` union tipinde `'UNKNOWN'` yoktu.

**Çözüm:**
```ts
// Öncesi
export type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_INFO' | 'MANUAL_REVIEW' | 'LEGAL_CONFLICT';

// Sonrası
export type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_INFO' | 'MANUAL_REVIEW' | 'LEGAL_CONFLICT' | 'UNKNOWN';
```

---

### Hata Grubu 7 — Index Signature Tip Uyuşmazlığı (3 hata)

**Dosya:** `eligibility-tester.component.ts` — Ln 134, 136, 165

```
Type 'string[] | undefined' has no matching index signature for type 'number'. ts(2537)
```

**Kök neden:** `reasons`, `missing_facts` alanları `string[]` olarak tanımlıydı ancak tester bunlara `{ code, field, message }` ve `{ key, message }` obje array'leri atıyordu. TypeScript `[number]` index erişiminde tip uyuşmazlığı veriyordu.

**Çözüm:** `eligibility.types.ts` dosyasına `ReasonItem` ve `MissingFactItem` interface'leri eklendi:
```ts
export interface ReasonItem {
  code?: string | null;
  field?: string | null;
  message: string;
}

export interface MissingFactItem {
  key: string;
  message: string;
}

export interface EligibilityCheckResult {
  reasons?: ReasonItem[];
  missing_facts?: MissingFactItem[];
}
```
Tester metodları `normalizeReasons(): ReasonItem[]` ve `normalizeMissingFacts(): MissingFactItem[]` olarak güncellendi; `satisfies` operatörü ile tip güvenliği sağlandı.

---

### Hata Grubu 8 — Kullanılmayan Template Import Uyarısı (1 uyarı)

**Dosya:** `result-card.component.ts` — Ln 10

```
ActionRoadmapComponent is not used within the template of ResultCardComponent. (-998113)
```

**Kök neden:** `ActionRoadmapComponent` component'in `imports` dizisine eklenmiş ancak `result-card.component.html` template'inde hiç kullanılmamıştı.

**Çözüm:** Import kaldırmak yerine template'e işlevsel olarak eklendi — `ELIGIBLE` sonuçta ve `benefitType` varsa başvuru yol haritası gösterilir:
```html
@if (tone() === 'eligible' && benefitType) {
  <app-action-roadmap [benefitType]="benefitType" />
}
```

---

### Değiştirilen / Oluşturulan Dosyalar

| Dosya | İşlem |
|-------|-------|
| `eligibility.types.ts` | `EligibilityStep`, `ReasonItem`, `MissingFactItem` eklendi; `GuidanceItem.url` optional yapıldı; `'UNKNOWN'` status'a eklendi; `user_message`/`disclaimer` → `string \| null` |
| `action-roadmap.component.ts` | Import yolları düzeltildi; `computed()` → getter; template `roadmap()` → `roadmap`; map parametrelerine tip eklendi |
| `eligibility-tester.component.ts` | `normalizeStrings` → `normalizeGuidanceItems`; `normalizeReasons`/`normalizeMissingFacts` typed interface'lere çevrildi |
| `result-card.component.html` | `app-action-roadmap` eligible durumda render edildi |
| `content/guidance-roadmap.data.ts` | **Yeni oluşturuldu** — `GuidanceRoadmap` interface + 4 benefit için roadmap verisi |

**Sonuç:** 15 hata → 0 hata
