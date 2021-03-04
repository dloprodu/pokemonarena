import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { PageComponent } from '@app/shared';
import { PokeApiService, ContextService, ThemeManagerService } from '@app/shared/services';
import { Language} from '@app/shared/models/language';

@Component({
  selector: 'page-setup',
  templateUrl: 'setup.page.html'
})
export class SetupPage extends PageComponent implements OnInit, OnDestroy {
  //#region Properties

  get id(): string { return 'setup-page'; }

  get pageName(): string {
    return 'Setup';
  }

  //#endregion

  //#region Fields

  themes = [
    {
      label: 'dark',
      value: 'dark',
    },
    {
      label: 'light',
      value: 'light'
    }
  ];

  languages: Language[] = [];

  renders = [
    {
      label: 'HTML',
      value: 'html',
    },
    {
      label: 'Canvas',
      value: 'canvas'
    }
  ];

  language = this.context.instance.language;
  theme = this.themeManager.getTheme();
  render = 'html';

  //#endregion

  //#region Constructor

  constructor(
    private context: ContextService,
    private pokeApi: PokeApiService,
    private themeManager: ThemeManagerService
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    this.pokeApi
      .getLanguages()
      .subscribe(res => {
        this.languages = res;
      }, err => {
        console.error(err);
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  //#endregion

  //#region PageComponent Methods

  public hasChanges(): boolean {
    return false;
  }

  //#endregion

  //#region Events Handlers

  onThemeChange(event: Event) {
    this.themeManager.change(this.theme);
  }

  onLanguageChange(event: Event) {
    this.context.setLanguage(this.language);
    // this.translate.use(code);
    // this.nativeLanguage = this.languages.find(lang => lang.code === this.context.instance.language).name;

    window.location.href = `${window.location.origin}/${this.language}`;
  }

  //#endregion
}