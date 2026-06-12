import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/components/header/header';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeService } from './core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MatToolbarModule, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('First_of_All_ui');
  private themeService = inject(ThemeService);

  constructor() {
    // Theme is automatically applied by ThemeService constructor
  }
}
