import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import { PageComponent, LiveGameService } from '@app/shared';
import { PokeApiService, ContextService, ThemeManagerService, RankingManagerService } from '@app/shared/services';
import { Language, User } from '@app/shared/models';

import { Observable, of } from 'rxjs';
import { mergeMap, takeWhile, finalize } from 'rxjs/operators';

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
  render: 'html' | 'canvas' = 'html';

  // - Game mode settings
  gameModes = [
    { label: '1 vs COM', value: '1vsCOM' },
    { label: '1 vs 1', value: '1vs1' }
  ];
  gameMode: '1vsCOM' | '1vs1' = '1vs1';

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

  private navigateToGamePage(user: User | null, live = false) {
    switch (this.render) {
      case 'html':
        this.router.navigate([`/${this.context.instance.language}/arena/arena-html`], {
          queryParams: { userId: user?.id, ...(live ? { live: true } : {}) }
        });
        break;

      case 'canvas':
        this.router.navigate([`/${this.context.instance.language}/arena/arena-canvas`], {
          queryParams: { userId: user?.id, ...(live ? { live: true } : {}) }
        });
        break;
    }
  }

  private getUser(): Observable<User> {
    this.loading = true;

    return this.rankingManager
      .getUser(this.gameMode === '1vs1' ? this.live.alias : this.alias)
      .pipe(
        mergeMap(user => {
          if (user == null) {
            return this.rankingManager.createUser(this.alias);
          }

          return of(user);
        }),
        finalize(() => this.loading = false)
      );
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
    this.getUser()
      .subscribe(user => {
        this.navigateToGamePage(user);
      }, err => {
        // If something was wrong, we simply navigate to the game without alias
        this.navigateToGamePage(null);
      });
  }

  onAcceptLiveRequestClick() {
    this.getUser()
      .subscribe(user => {
        this.navigateToGamePage(user, true);
      }, err => {
        // If something was wrong, we simply navigate to the game without alias
        this.navigateToGamePage(null, true);
      });
  }

  //#endregion
}
