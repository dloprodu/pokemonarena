import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  Input,
} from '@angular/core';

import { BaseComponent, RankingManagerService } from '@app/shared';
import { RankingItem } from '@app/shared/models';

/**
 * Move picker component.
 */
@Component({
  selector: 'ranking-table',
  templateUrl: 'ranking-table.html',
  styleUrls: ['ranking-table.scss'],
})
export class RankingTableComponent extends BaseComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {

  //#region Input

  @Input() userId: string;

  //#endregion

  //#region Outputs

  userRanking: RankingItem[];
  generalRanking: RankingItem[];
  general = true;

  //#endregion

  //#region Constructor

  constructor(private rankingManager: RankingManagerService) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    this.loadRanking();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userId?.currentValue) {
      this.loadUserRanking();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  //#endregion

  //#region Methods

  public refresh() {
    this.loadRanking();
    this.loadUserRanking();
  }

  //#endregion

  //#region Methods

  trackByFn = (index: number, item: RankingItem) => item.id;

  //#endregion

  //#region Helpers

  private loadRanking() {
    this.rankingManager
      .getRanking({ date: 'month', sort: '-score'}, 0, 100)
      .subscribe(result => {
        this.generalRanking = result;
      });
  }

  private loadUserRanking() {
    if (!this.userId) {
      return;
    }

    this.rankingManager
      .getRanking({ userId: this.userId, sort: '-date' }, 0, 100)
      .subscribe(result => {
        console.log('----> %O', result);
        this.userRanking = result;
      });
  }

  //#endregion

  //#region Events Handlers

  onToggleRanking() {
    this.general = !this.general;
  }

  //#endregion
}
