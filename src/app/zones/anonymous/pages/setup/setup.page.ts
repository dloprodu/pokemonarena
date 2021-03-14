import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import { PageComponent, LiveGameService, StorageService } from '@app/shared';
import { PokeApiService, ContextService, ThemeManagerService } from '@app/shared/services';
import { Language } from '@app/shared/models';

import { takeWhile } from 'rxjs/operators';

type GameModeType = '1vsCOM' | '1vs1';
type GameRenderType = 'html' | 'canvas';

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

  // - Theme settings
  themes = [
    { label: 'dark', value: 'dark' },
    { label: 'light', value: 'light' }
  ];
  theme = this.themeManager.getTheme();

  // - Language settings
  languages: Language[] = [];
  language = this.context.instance.language;

  // - Renders settings
  renders = [
    { label: 'HTML', value: 'html' },
    { label: 'Canvas', value: 'canvas' }
  ];
  render: GameRenderType = 'html';

  // - Game mode settings
  gameModes = [
    { label: '1 vs COM', value: '1vsCOM' },
    { label: '1 vs 1', value: '1vs1' }
  ];
  gameMode: GameModeType = this.storage.get('game-mode', '1vsCOM') as GameModeType;

  alias = '';
  aliasInUse = false;
  loading = false;

  //#endregion

  //#region Constructor

  constructor(
    private context: ContextService,
    public live: LiveGameService,
    private pokeApi: PokeApiService,
    private themeManager: ThemeManagerService,
    private router: Router,
    private storage: StorageService
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

    this.live
      .aliasInUse
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(() => this.aliasInUse = true);

    this.live
      .acceptedRequest
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(() => this.onAcceptLiveRequestClick());
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

  private navigateToGamePage(alias: string, live = false) {
    this.storage.set('game-mode', this.gameMode);

    switch (this.render) {
      case 'html':
        this.router.navigate([`/${this.context.instance.language}/arena/arena-html`], {
          queryParams: { alias, ...(live ? { live: true } : {}) }
        });
        break;

      case 'canvas':
        this.router.navigate([`/${this.context.instance.language}/arena/arena-canvas`], {
          queryParams: { alias, ...(live ? { live: true } : {}) }
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

  onSignInLiveClick() {
    this.live.signIn(this.alias);
  }

  onPlayClick() {
    this.navigateToGamePage(this.alias);
  }

  onAcceptLiveRequestClick() {
    this.navigateToGamePage(this.live.alias, true);
  }

  //#endregion
}
