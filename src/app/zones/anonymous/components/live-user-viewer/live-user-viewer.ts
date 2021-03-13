import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

import { BaseComponent, LiveGameService, LiveUser } from '@app/shared';

import { takeWhile } from 'rxjs/operators';

/**
 * Live users viewer component.
 */
@Component({
  selector: 'live-user-viewer',
  templateUrl: 'live-user-viewer.html',
  styleUrls: ['live-user-viewer.scss'],
})
export class LiveUserViewerComponent extends BaseComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {

  //#region Outputs

  @Output() readonly acceptRequestClick = new EventEmitter();

  //#endregion

  //#region Region

  liveUsers: LiveUser[] = [];

  //#endregion

  //#region Constructor

  constructor(
    public live: LiveGameService
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    this.live
      .getLiveUsers()
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(users => {
        this.liveUsers = users.filter(u => u.alias !== this.live.alias);
      });
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

  //#region Event Handlers

  onSendRequest(user: LiveUser) {
    this.live.sendPlayRequest(user);
  }

  onAcceptRequest() {
    this.live.acceptRequest();
    this.acceptRequestClick.emit();
  }

  onRejectRequest() {
    this.live.rejectRequest();
  }

  //#endregion
}
