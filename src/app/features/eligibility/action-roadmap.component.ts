import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ROADMAP_DATA, GuidanceRoadmap } from './content/guidance-roadmap.data';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-action-roadmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="roadmap as data" class="mt-8 pt-8 border-t border-slate-200">
      
      <!-- Kurumsal Uyarı & Başlık (KVKK Uyumlu) -->
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-slate-900">{{ data.title }}</h3>
        <p class="text-sm text-slate-500 mt-2 flex items-start gap-2">
          <span class="text-amber-500 font-bold text-lg leading-none">!</span>
          {{ data.caution }}
        </p>
        <div class="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
          <span>📍 Başvuru Mercii:</span>
          <span class="font-bold">{{ data.institution }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Adım Adım Zaman Çizelgesi (Timeline) -->
        <div class="relative border-l-2 border-slate-200 ml-4 space-y-8 py-2">
          <div *ngFor="let step of data.steps; let i = index" class="relative pl-8">
            <span class="absolute -left-[17px] top-0 bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white shadow-sm">
              {{ i + 1 }}
            </span>
            <h4 class="font-semibold text-slate-900 text-lg">{{ step.title }}</h4>
            <p class="text-slate-600 mt-1 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>

        <!-- Gerekli Evraklar (Checklist) -->
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
          <h4 class="font-bold text-slate-900 mb-4 text-lg border-b border-slate-200 pb-3">Hazırlanması Gereken Evraklar</h4>
          <div *ngFor="let doc of data.documents" class="mb-5 last:mb-0">
            <h5 class="font-semibold text-slate-800 text-sm uppercase tracking-wide mb-2">{{ doc.category }}</h5>
            <ul class="space-y-2">
              <li *ngFor="let item of doc.items" class="text-slate-600 text-sm flex items-start gap-2">
                <span class="text-emerald-500 mt-0.5 font-bold">✓</span>
                <span class="leading-snug">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionRoadmapComponent implements OnInit {
  @Input({ required: true }) benefitType!: string;

  private analytics = new AnalyticsService();

  get roadmap(): GuidanceRoadmap | null {
    return ROADMAP_DATA[this.benefitType] ?? null;
  }

  ngOnInit(): void {
    if (this.benefitType) {
      this.analytics.trackEvent('roadmap_viewed', { benefit_type: this.benefitType });
    }
  }

  copyRoadmap(data: GuidanceRoadmap): void {
    const textToCopy = `
${data.title}
📍 Kurum: ${data.institution}

ADIMLAR:
${data.steps.map((s: { title: string; description: string }, i: number) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}

* Sosyal Hak Rehberi üzerinden oluşturulmuştur.
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      // Kopyalama analitiğini gönder
      this.analytics.trackEvent('roadmap_copied', { benefit_type: this.benefitType });
      // Dilersen buraya Angular üzerinden küçük bir "Kopyalandı" Toast mesajı ekleyebiliriz
      alert('Yol haritası panoya kopyalandı! İstediğiniz yere yapıştırabilirsiniz.');
    });
  }
}