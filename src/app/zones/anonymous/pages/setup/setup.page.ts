import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import { PageComponent } from '@app/shared';
import { PokeApiService, ContextService, ThemeManagerService, RankingManagerService } from '@app/shared/services';
import { Language, User } from '@app/shared/models';

import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

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
  alias = '';

  //#endregion

  //#region Constructor

  constructor(
    private context: ContextService,
    private pokeApi: PokeApiService,
    private themeManager: ThemeManagerService,
    private rankingManager: RankingManagerService,
    private router: Router
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    this.pokeApi
      .getLanguageList()
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

  //#region Helpers

  private navigateToGamePage(user: User | null) {
    switch (this.render) {
      case 'html':
        this.router.navigate([`/${this.context.instance.language}/arena/arena-html`], {
          queryParams: { userId: user?.id }
        });
        break;

      case 'canvas':
        this.router.navigate([`/${this.context.instance.language}/arena/arena-canvas`], {
          queryParams: { userId: user?.id }
        });
        break;
    }
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

  onPlayClick() {
    this.rankingManager
      .getUser(this.alias)
      .pipe(
        mergeMap(user => {
          if (user == null) {
            return this.rankingManager.createUser(this.alias);
          }

          return of(user);
        })
      ).subscribe(user => {
        this.navigateToGamePage(user);
      }, err => {
        // If something was wrong, we simply navigate to the game without alias
        this.navigateToGamePage(null);
      })
  }

  //#endregion
}
