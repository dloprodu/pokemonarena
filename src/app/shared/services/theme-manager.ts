import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { StorageService } from './storage';

type ThemeType = 'dark' | 'light';

/**
 * @file theme-manager.service.js
 * @summary Theme manager service.
 * @description
 *
 * @version 0.0.0
 * @copyright 2021
 */
@Injectable()
export class ThemeManagerService {
  //#region Const

  readonly STORAGE_KEY = 'theme';
  readonly DEFAULT_THEME: ThemeType = 'light';

  //#endregion

  //#region Fields

  private theme: ThemeType;

  //#endregion

  //#region Events
  //#endregion

  //#region Constructor

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private storage: StorageService
  ) {
    this.theme = this.storage.get(this.STORAGE_KEY, this.DEFAULT_THEME) as ThemeType;
    this.refreshBody();
  }

  //#endregion

  //#region Methods

  public load() {
    this.refreshBody();
  }

  public getTheme(): ThemeType {
    return this.theme;
  }

  public change(theme: ThemeType) {
    this.theme = theme;
    this.storage.set(this.STORAGE_KEY, theme);
    this.refreshBody();
  }

  //#endregion

  //#region Helpers

  private refreshBody() {
    switch (this.theme) {
      case 'light':
        this.document.body.classList.remove('dark');
        this.document.body.classList.add(this.theme);
        break;

      case 'dark':
        this.document.body.classList.remove('light');
        this.document.body.classList.add(this.theme);
        break;
    }
  }

  //#endregion
}
