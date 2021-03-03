import { OnInit, OnDestroy, AfterViewInit, Directive } from '@angular/core';

/**
 * Base entity page component.
 */
@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  //#region Properties

  /**
   * Flag that indicates if the page has been destroyed or is still alive. Useful, for example, to link rxjs
   * observers to the component cycle live using the takeWhile operator.
   *
   * @type {boolean}
   * @memberof ManagerPage
   * @public
   */
  get alive(): boolean {
    return this._alive;
  }

  //#endregion

  //#region Fields

  private _alive = true;

  //#endregion

  //#region Constructor

  constructor(
  ) {
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
  }

  ngOnDestroy() {
    this._alive = false;
  }

  ngAfterViewInit() {
  }

  //#endregion

  //#region Abstract Methods
  //#endregion

  //#region Public Methods
  //#endregion

  //#region Protected methods
  //#endregion
}
