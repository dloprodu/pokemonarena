import { Injectable, EventEmitter } from '@angular/core';

import { environment } from '@env/environment';

import { io, Socket } from 'socket.io-client';

import { Competitor } from '../utils/competitor';

import { Observable, ReplaySubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export type LiveUser = {
  alias: string,
  loggedAt: string;
  battlefieldId: string;
  waitingResponseFrom: string;
  attendingRequestTo: string;
};

type LiveUserResponse = { users: LiveUser[] };
type LoggedResponse = { alias: string, users: LiveUser[] };

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

  /**
   * Initial turn owner;
   */
  get initialTurnOwner(): string {
    return this._initialTurnOwner;
  }

  //#endregion

  //#region Events

  /**
   * Event emitted when the alias is already in use for another live user.
   */
  readonly aliasInUse = new EventEmitter();

  /**
   * Event emitted the user receive a 'play request' from a live user.
   */
  readonly playRequest = new EventEmitter<string>();

  /**
   * Event emitted when a live user has accepted a 'play request'.
   */
  readonly acceptedRequest = new EventEmitter<string>();

  /**
   * Event emitted when a live user has rejected a 'play request'.
   */
  readonly rejectedRequest = new EventEmitter<string>();

  /**
   * Event emitted when an opponent disconnects from the battle.
   */
  readonly opponentDisconnected = new EventEmitter();

  /**
   * Event emitted when an opponent is ready to the battle and has sent its data.
   */
  readonly opponentReady = new EventEmitter<Competitor>();

  /**
   * Event emitted when the player asks the opponent to reload the battle.
   */
  readonly reloadBattleRequest = new EventEmitter();

  /**
   * Event emitted at the beginning of a battle to set the turn owner.
   */
  readonly resetTurn = new EventEmitter<string>();

  /**
   * Event emitted when the opponent send a movement or louse its turn.
   */
  readonly moveReceived = new EventEmitter<number>();

  /**
   * Event emitted when the player lose its turn by timeout.
   */
  readonly timeout = new EventEmitter();

  //#endregion

  //#region Fields

  private socket: Socket;
  private _maxTurnTime = 15000;
  private _liveUsers = new ReplaySubject<LiveUser[]>(1);
  private _liveUsers$: Observable<LiveUser[]>;
  private _logged = false;
  private _alias = '';
  private _opponent: string;
  private _initialTurnOwner: string;

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

  /**
   * Setup the socket connection.
   */
  init() {
    this.setupSocketConnection();
  }

  /**
   * Sign in as user in the live service.
   */
  signIn(alias: string) {
    if (!alias?.trim()) {
      return;
    }

    if (this.logged && this._alias === alias) {
      return;
    }

    if (this.logged) {
      this.socket?.emit('sign out', alias);
    }

    this.socket?.emit('sign in', alias);
  }

  /**
   * Returns an observable that will emit the live users whenever
   * they are updated.
   */
  getLiveUsers(): Observable<LiveUser[]> {
    return this._liveUsers$;
  }

  /**
   * Allows sending a play request to another live user.
   */
  sendPlayRequest(user: LiveUser) {
    if (this._requestTimer) {
      return;
    }

    this._opponent = user.alias;
    this.socket?.emit('play request', user.alias);
    this.initRequestTimer('request');
  }

  /**
   * Allows to accept a play request.
   */
  acceptRequest() {
    this.stopTimer();
    this.socket?.emit('accept request', this._opponent);
  }

  /**
   * Allows to reject a play request.
   */
  rejectRequest() {
    this.stopTimer();
    this.socket?.emit('reject request', this._opponent);
    this._opponent = '';
  }

  /**
   * Send a message to notify that the player has left the battle.
   */
  leaveBattle() {
    this.socket?.emit('leave battle');
  }

  /**
   * Send a message to notify the opponent that the player is ready and
   * attach the player data.
   */
  playerReady(data: Competitor) {
    this.socket?.emit('player ready', data);
  }

  /**
   * Send a message to ask the opponent to reload the battle
   * and send us its new data.
   */
  reloadBattle() {
    this.socket?.emit('reload battle');
  }

  /**
   * Send a movement to the opponent.
   */
  sendMove(index: number) {
    this.stopTimer();
    this.socket?.emit('move', index);
  }

  /**
   * Inits the turn timer.
   */
  initTurnTimer() {
    this.initRequestTimer('turn');
  }

  //#endregion

  //#region Helpers

  private setupSocketConnection() {
    try {
      this.socket = io(this.liveApi.baseUrl);

      this.socket.on('connect', () => this.reset());
      this.socket.on('disconnect', () => this.reset());

      // Once event
      this.socket.once('max turn time', this.onMaxTurnTime);

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
      this.socket.on('opponent ready', this.onOpponentReady);
      this.socket.on('reload battle', this.onReloadBattle);
      this.socket.on('reset turn', this.onResetTurn);
      this.socket.on('move', this.onMoveReceived);

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
        this.stopTimer();

        if (this._requestTimerType === 'attend-request') {
          this.rejectRequest();
          this._opponent = '';
        }

        if (this._requestTimerType === 'turn') {
          this.timeout.emit();
          this.sendMove(undefined);
        }
      }
    }, 1000);
  }

  //#endregion

  //#region Helpers

  private reset() {
    this._logged = false;
    this._opponent = '';
    this._opponent = '';
    this.stopTimer();
  }

  private stopTimer() {
    this._requestTimer = 0;
    clearInterval(this._requestTimerRef);
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
  }

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
  }

  private onSignedOut = (data: LoggedResponse) => {
    this._logged = false;
    this._liveUsers.next(data.users);
  }

  private onUserJoined = (data: LiveUserResponse) => {
    this._liveUsers.next(data.users);
  }

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

  private onOpponentReady = (data: Competitor) => {
    this.opponentReady.emit(data);
  }

  private onReloadBattle = () => {
    this.reloadBattleRequest.emit();
  }

  private onResetTurn = (owner: string) => {
    this._initialTurnOwner = owner;
    this.resetTurn.emit(owner);
  }

  private onMoveReceived = (index) => {
    this.moveReceived.emit(index);
  }

  //#endregion
}
