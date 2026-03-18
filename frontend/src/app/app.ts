import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { Loader } from './shared/components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Loader, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  isLoginPage = false;

  constructor() {
    // A simple synchronous check before Angular engine starts rendering.
    if (isPlatformBrowser(this.platformId)) {
      const path = window.location.pathname;
      this.isLoginPage = path.includes('/login') || path === '/';
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.urlAfterRedirects.includes('/login');
      }
    });
  }
}
