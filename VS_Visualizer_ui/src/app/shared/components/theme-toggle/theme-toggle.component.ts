import { Component, inject, computed } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  currentMode = this.themeService.currentMode;

  iconName = computed(() => {
    const mode = this.themeService.currentMode();
    if (mode === 'dark') return 'light_mode';
    if (mode === 'light') return 'brightness_4';
    return 'dark_mode';
  });

  tooltipText = computed(() => {
    const mode = this.themeService.currentMode();
    if (mode === 'dark') return 'Switch to Light';
    if (mode === 'light') return 'Switch to Gray';
    return 'Switch to Dark';
  });

  toggle(): void {
    this.themeService.toggle();
  }
}
