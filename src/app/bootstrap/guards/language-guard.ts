import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  PRIMARY_OUTLET,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { ContextService, PokeApiService } from '@app/shared';
import { Context } from '@app/shared/models';

import { Observable } from 'rxjs';

@Injectable()
export class LanguageGuard implements CanActivate, CanActivateChild {
  constructor(
    private pokeApi: PokeApiService,
    private context: ContextService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private translate: TranslateService,
    ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLanguage(state.url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLanguage(state.url);
  }

  private checkLanguage(url: string): boolean {
    // route: `/:mandator/:language/...`
    const context = this.context.getInstance<Context>();
    const urlTree = this.router.parseUrl(url);
    const urlSegments = urlTree.root.children?.[PRIMARY_OUTLET]?.segments ?? [];
    const urlLanguage = (urlSegments?.[0]?.path ?? '').toLocaleLowerCase();

    // Check URL language - if `languages` is not defined, that is a backend wrong settigns.
    if (!urlLanguage || !this.pokeApi.AVAILABLE_LANG_MAP[urlLanguage]) {
      const userLang = this.pokeApi.AVAILABLE_LANG_MAP[navigator.language] ? navigator.language : 'en';

      // Force to reload the page.
      window.location.href = `${window.location.origin}/${userLang}`;

      return false;
    }

    this.document.documentElement.lang = urlLanguage;

    if (this.context.instance.language !== urlLanguage) {
      this.context.setLanguage(urlLanguage);
      this.translate.use(urlLanguage);
    }

    return true;
  }
}
