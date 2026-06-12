import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<string>('en');

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    
    effect(() => {
      const lang = this.currentLang();
      this.translate.use(lang);
      this.setDirection(lang);
    });
  }

  toggleLanguage(): void {
    this.currentLang.update(lang => lang === 'en' ? 'ar' : 'en');
  }

  private setDirection(lang: string): void {
    // Keep LTR direction, only change lang attribute
    document.documentElement.setAttribute('lang', lang);
  }

  get isArabic(): boolean {
    return this.currentLang() === 'ar';
  }
}
