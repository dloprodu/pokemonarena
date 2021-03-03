import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { PageComponent } from '@app/shared';

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