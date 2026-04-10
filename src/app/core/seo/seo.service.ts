import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';

export interface SeoPageConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly siteUrl = environment.siteUrl.replace(/\/$/, '');

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  setPage(config: SeoPageConfig): void {
    const pageUrl = this.resolveUrl(config.path ?? '/');
    const pageTitle = `${config.title} | Sosyal Hak Rehberi`;

    this.title.setTitle(pageTitle);
    this.setOrUpdateMeta('description', config.description);
    this.setOrUpdateMeta('robots', config.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    this.setOrUpdateMeta('theme-color', '#0b1220');

    this.setProperty('og:title', pageTitle);
    this.setProperty('og:description', config.description);
    this.setProperty('og:type', config.type ?? 'website');
    this.setProperty('og:url', pageUrl);
    this.setProperty('og:image', this.resolveUrl(config.image ?? '/assets/hero.jpg'));
    this.setProperty('og:locale', 'tr_TR');

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', pageTitle);
    this.setName('twitter:description', config.description);
    this.setName('twitter:image', this.resolveUrl(config.image ?? '/assets/hero.jpg'));

    this.setCanonical(pageUrl);
  }

  setStructuredData(schema: Record<string, unknown> | Array<Record<string, unknown>>): void {
    const existing = this.document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }

    const script = this.document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  setHomeStructuredData(): void {
    this.setStructuredData([
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Sosyal Hak Rehberi',
        url: this.resolveUrl('/'),
        description: 'Vatandaşların sosyal haklara erişimini açıklayan ve başvuru yolunu öğreten dijital rehber.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Sosyal Hak Rehberi',
        url: this.resolveUrl('/'),
        inLanguage: 'tr-TR',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${this.resolveUrl('/')}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ]);
  }

  clearStructuredData(): void {
    const existing = this.document.getElementById('structured-data');
    existing?.remove();
  }

  private setCanonical(url: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  private resolveUrl(path: string): string {
    return `${this.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private setOrUpdateMeta(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }
}
