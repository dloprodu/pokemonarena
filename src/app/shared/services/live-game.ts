import { Injectable, EventEmitter } from '@angular/core';

import { environment } from '@env/environment';

import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export type LiveUser = { alias: string, loggedAt: string; battlefieldId: string, waitingResponseFrom: string; attendingRequestTo: string }
type LiveUserResponse = { users: LiveUser[] }
type LoggedResponse = { alias: string, users: LiveUser[] }

type RequestTimerType = 'request' | 'attend-request' | 'turn';

/**
 * @file live-game.ts
 * @summary Ranking API service.
 * @description
 *
 * @version 0.0.0
 * @copyright 2021
 */
@Injectable()
export class LiveGameService {
  //#region Properties

  get liveApi(): { baseUrl: string, defaultHeaders: { [key: string]: string } } {
    return environment.context.assets.liveAPI;
  }

  get logged(): boolean {
    return this._logged;
  }

  get alias(): string {
    return this._alias;
  }

  get opponent(): string {
    return this._opponent;
  }

  get maxTurnTime(): number {
    return this._maxTurnTime;
  }

  /**
   * Indicates if the user is waiting for a opponent request response or
   * has to accept/reject a request.
   */
  get hasPendingRequest(): boolean {
    return this._requestTimer > 0;
  }

  /**
   * Request timer type.
   */
  get requestTimerType(): RequestTimerType {
    return this._requestTimerType;
  }

  /**
   * Request timer.
   */
  get requestTime(): number {
    return this._requestTimer / 1000;
  }

  //#endregion

  //#region Events

  readonly aliasInUse = new EventEmitter();
  readonly playRequest = new EventEmitter<string>();
  readonly acceptedRequest = new EventEmitter<string>();
  readonly rejectedRequest = new EventEmitter<string>();
  readonly opponentDisconnected = new EventEmitter();

  //#endregion

  //#region Fields

  private socket: Socket;
  private _maxTurnTime = 15000;
  private _liveUsers = new ReplaySubject<LiveUser[]>(1);
  private _liveUsers$: Observable<LiveUser[]>;
  private _logged = false;
  private _alias = '';
  private _opponent: string;

  // - Request timers
  private _requestTimer = 0;
  private _requestTimerType: RequestTimerType = 'request';
  private _requestTimerRef;

  //#endregion

  //#region Constructor

  constructor() {
    this._liveUsers$ = this._liveUsers
      .asObservable()
      .pipe(shareReplay<LiveUser[]>(1));
  }

  //#endregion

  //#region Methods

  init() {
    this.setupSocketConnection();
  }

  signIn(alias: string) {
    if (!alias?.trim()) {
      return;
    }

    if (this.logged && this._alias === alias) {
      return;
    }

    if (this.logged) {
      this.socket?.emit('remove user', alias);
    }

    this.socket?.emit('add user', alias);
  }

  getLiveUsers(): Observable<LiveUser[]> {
    return this._liveUsers$;
  }

  sendPlayRequest(user: LiveUser) {
    if (this._requestTimer) {
      return;
    }

    this._opponent = user.alias;
    this.socket?.emit('play request', user.alias);
    this.initRequestTimer('request');
  }

  acceptRequest() {
    clearInterval(this._requestTimerRef);
    this._requestTimer = 0;
    this.socket?.emit('accept request', this._opponent);
  }

  rejectRequest() {
    clearInterval(this._requestTimerRef);
    this._requestTimer = 0;
    this.socket?.emit('reject request', this._opponent);
    this._opponent = '';
  }

  //#endregion

  //#region Helpers

  private setupSocketConnection() {
    try {
      this.socket = io(this.liveApi.baseUrl);

      // Once event
      this.socket.once('max turn time', this.onMaxTurnTime)

      // General messages
      this.socket.on('message', this.onMessage);

      // Events that notify changes in the user list
      this.socket.on('signed in', this.onSignedIn);
      this.socket.on('signed out', this.onSignedOut);
      this.socket.on('user joined', this.onUserJoined);
      this.socket.on('user left', this.onUserLeft);
      this.socket.on('users', this.onUsersUpdated);

      // Play requests
      this.socket.on('play request', this.onPlayRequest);
      this.socket.on('accepted request', this.onAcceptedRequest);
      this.socket.on('rejected request', this.onRejectedRequest);

      // this.socket.emit('fetch users');
      console.log('live game socket connected....');
    } catch (err) {
      console.error(err);
    }
  }

  private initRequestTimer(type: RequestTimerType) {
    this._requestTimerType = type;
    this._requestTimer = this._maxTurnTime;
    this._requestTimerRef = setInterval(() => {
      this._requestTimer -= 1000;

      if (this._requestTimer <= 0) {
        this._requestTimer = 0;
        clearInterval(this._requestTimerRef);

        if (this._requestTimerType === 'attend-request') {
          this.rejectRequest();
        }

        this._opponent = '';
      }
    }, 1000);
  }

  //#endregion

  //#region Socket Event Handlers

  private onMessage = (message: string) => {
    switch (message) {
      case 'alias in use':
        this.aliasInUse.emit();
        break;

      case 'play request not attended':
        break;

      case 'opponent disconnected':
        this.opponentDisconnected.emit();
        break;
    }
  };

  private onMaxTurnTime = (data: { time: number }) => {
    this._maxTurnTime = data.time;
  }

  private onUsersUpdated = (data: LiveUserResponse) => {
    this._liveUsers.next(data.users);
  }

  private onSignedIn = (data: LoggedResponse) => {
    this._logged = true;
    this._alias = data.alias;
    this._liveUsers.next(data.users);
  };

  private onSignedOut = (data: LoggedResponse) => {
    this._logged = false;
    this._liveUsers.next(data.users);
  };

  private onUserJoined = (data: LiveUserResponse) => {
    this._liveUsers.next(data.users);
  };

  private onUserLeft = (data: LiveUserResponse) => {
    this._liveUsers.next(data.users);
  }

  //#endregion

  //#region Socket Event Handlers - Play Request

  private onPlayRequest = (data: { from: string }) => {
    this._opponent = data.from;
    this.playRequest.emit(data.from);
    this.initRequestTimer('attend-request');
  }

  private onAcceptedRequest = (data: { from: string }) => {
    clearInterval(this._requestTimerRef);
    this._requestTimer = 0;
    this.acceptedRequest.emit(data.from);
  }

  private onRejectedRequest = (data: { from: string }) => {
    clearInterval(this._requestTimerRef);
    this._requestTimer = 0;
    this.rejectedRequest.emit(data.from);
  }

  //#endregion
}
