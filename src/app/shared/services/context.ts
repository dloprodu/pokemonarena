import { Injectable, EventEmitter } from '@angular/core';

import { Context } from '../models/context';

import { StorageService } from './storage';

/**
 * @file context.service.js
 * @summary Context service.
 * @description
 *
 * @version 0.0.0
 * @copyright 2021
 */
@Injectable()
export class ContextService {
  //#region Properties

  get instance(): Context {
    return this._context!;
  }

  //#endregion

  //#region Fields

  private _context?: Context;

  //#endregion

  //#region Events

  private _ready: EventEmitter<Context> = new EventEmitter<Context>();

  public get ready(): EventEmitter<Context> {
    return this._ready;
  }

  //#endregion

  //#region Constructor

  constructor(private storage: StorageService) { }

  //#endregion

  //#region Methods

  public async load() {
    this._context = await Context.factory();
    this._ready.emit(this._context);
  }

  public getInstance<T extends Context>(): T {
    return this._context as T;
  }

  /**
   * Updates the language and local storage copy.
   *
   */
  public setLanguage(code: string) {
    if (!this.instance) {
      return;
    }

    this.instance.language = code;
    this.storage.set(this.instance.STORAGE_LANGUAGE, code);
  }

  /**
   * Get the latest storage language.
   */
  public getStoredLanguage(): string {
    const code = this.storage.get(this.instance.STORAGE_LANGUAGE);

    return code;
  }

  //#endregion
}
