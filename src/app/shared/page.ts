import { OnInit, OnDestroy, AfterViewInit, Directive } from '@angular/core';
import { BaseComponent } from './base-component';

/**
 * Base entity page component.
 */
@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class PageComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  //#region Properties

  abstract get id(): string;

  abstract get pageName(): string;

  //#endregion

  //#region Fields
  //#endregion

  //#region Constructor

  constructor(
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  //#endregion

  //#region Abstract Methods

  /**
   * Returns a flag that indicates if the entity has changes.
   */
  public abstract hasChanges(): boolean;

  //#endregion

  //#region Public Methods
  //#endregion

  //#region Protected methods
  //#endregion
}
