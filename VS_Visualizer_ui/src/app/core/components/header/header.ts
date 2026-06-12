import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { LanguageToggleComponent } from '../../../shared/components/language-toggle/language-toggle.component';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink, RouterLinkActive, TranslateModule, ThemeToggleComponent, LanguageToggleComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {}
