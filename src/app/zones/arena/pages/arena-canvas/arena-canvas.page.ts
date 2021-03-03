import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { PageComponent } from '@app/shared';

@Component({
  selector: 'page-arena-canvas',
  templateUrl: 'arena-canvas.page.html'
})
export class ArenaCanvasPage extends PageComponent implements OnInit, OnDestroy {
  //#region Properties

  get id(): string { return 'arena-canvas-page'; }

  get pageName(): string {
    return 'Arena Canvas';
  }

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

  //#endregion

  //#region PageComponent Methods

  public hasChanges(): boolean {
    return false;
  }

  //#endregion
}