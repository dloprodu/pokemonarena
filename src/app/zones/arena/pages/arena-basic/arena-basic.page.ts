import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { PageComponent } from '@app/shared';

@Component({
  selector: 'page-arena-basic',
  templateUrl: 'arena-basic.page.html'
})
export class ArenaBasicPage extends PageComponent implements OnInit, OnDestroy {
  //#region Properties

  get id(): string { return 'arena-basic-page'; }

  get pageName(): string {
    return 'Arena Basic';
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