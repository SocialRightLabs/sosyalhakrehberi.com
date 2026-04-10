import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    const route = this.restoreFallbackRoute();
    if (!route) {
      return;
    }

    queueMicrotask(() => {
      void this.router.navigateByUrl(route, { replaceUrl: true });
    });
  }

  private restoreFallbackRoute(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const url = new URL(window.location.href);
    const fallbackRoute = url.searchParams.get('__route');

    if (!fallbackRoute || !fallbackRoute.startsWith('/')) {
      return null;
    }

    url.searchParams.delete('__route');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);

    return fallbackRoute;
  }
}
