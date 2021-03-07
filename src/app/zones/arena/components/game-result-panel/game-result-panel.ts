import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { BaseComponent } from '@app/shared';
import { Competitor } from '@app/shared/utils/competitor';

/**
 * Cart preview overlay item.
 */
@Component({
  selector: 'game-result-panel',
  templateUrl: 'game-result-panel.html',
  styleUrls: ['game-result-panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameResultPanelComponent extends BaseComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  //#region Inputs

  @Input() player!: Competitor;

  //#endregion

  //#region Constructor

  constructor() {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  //#endregion
}
