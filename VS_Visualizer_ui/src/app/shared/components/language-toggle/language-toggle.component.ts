import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.css'
})
export class LanguageToggleComponent {
  private languageService = inject(LanguageService);

  toggle(): void {
    this.languageService.toggleLanguage();
  }

  get currentLang(): string {
    return this.languageService.currentLang();
  }
}
