import { Injectable } from '@angular/core';

/**
 * @file storage.service.js
 * @summary Storage service.
 * @description
 *
 * @version 0.0.0
 * @copyright 2020
 */
@Injectable()
export class StorageService {
  //#region Properties

  get spaceName(): string {
    if (this._spaceName) {
      return this._spaceName;
    }

    return '';
  }

  set spaceName(value: string) {
    this._spaceName = value;
  }

  //#endregion

  //#region Fields

  private _spaceName = '';

  //#endregion

  //#region Constructor

  constructor() {}

  //#endregion

  //#region Methods

  getKey(key: string): string {
    if (this.spaceName) {
      return [this.spaceName, key].join('-');
    }

    return key;
  }

  contains(key: string): boolean {
    return window.localStorage.getItem(this.getKey(key)) !== null;
  }

  set(key: string, value: string): void {
    window.localStorage[this.getKey(key)] = value;
  }

  setObject(key: string, value: object): void {
    window.localStorage[this.getKey(key)] = JSON.stringify(value);
  }

  get(key: string, defaultValue?: string): string {
    return window.localStorage[this.getKey(key)] || defaultValue;
  }

  getObject(key: string, defaultValue?: any): any {
    const value = window.localStorage[this.getKey(key)];
    return value ? JSON.parse(value || defaultValue) : defaultValue;
  }

  getAndRemove(key: string, defaultValue: string): string {
    if (!this.contains(key)) {
      return defaultValue;
    }

    const value = this.get(key, defaultValue);

    window.localStorage.removeItem(this.getKey(key));

    return value;
  }

  getObjectAndRemove(key: string, defaultValue: any): any {
    if (!this.contains(key)) {
      return defaultValue;
    }

    const value = this.getObject(key, defaultValue);

    window.localStorage.removeItem(this.getKey(key));

    return value;
  }

  remove(key: string): void {
    window.localStorage.removeItem(this.getKey(key));
  }

  //#endregion
}
