import { Injectable, signal, computed } from '@angular/core';

type ThemeMode = 'light' | 'gray' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private mode = signal<ThemeMode>('dark');

  constructor() {
    const saved = localStorage.getItem('theme') as ThemeMode;
    if (saved && ['light', 'gray', 'dark'].includes(saved)) {
      this.mode.set(saved);
    }
    this.applyTheme(this.mode());
  }

  currentMode = computed(() => this.mode());

  toggle(): void {
    const next: Record<ThemeMode, ThemeMode> = {
      dark: 'light',
      light: 'gray',
      gray: 'dark'
    };
    this.mode.set(next[this.mode()]);
    this.applyTheme(this.mode());
    localStorage.setItem('theme', this.mode());
  }

  private applyTheme(mode: ThemeMode): void {
    document.body.classList.remove('dark-theme', 'gray-theme', 'light-theme');
    document.body.classList.add(`${mode}-theme`);
  }
}
