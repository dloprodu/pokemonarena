import { Injectable, EventEmitter } from '@angular/core';

import { environment } from '@env/environment';

import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export type LiveUser = { alias: string, loggedAt: string; }
type LiveUserResponse = { users: LiveUser[] }
type LoggedResponse = { alias: string, users: LiveUser[] }

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

  //#endregion

  //#region Events

  readonly aliasInUse = new EventEmitter();

  //#endregion

  //#region Fields

  private socket: Socket;
  private _liveUsers = new ReplaySubject<LiveUser[]>(1);
  private _liveUsers$: Observable<LiveUser[]>;
  private _logged = false;
  private _alias = '';

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

  //#endregion

  //#region Helpers

  private setupSocketConnection() {
    try {
      this.socket = io(this.liveApi.baseUrl);
      this.socket.on('alias in use', this.onAliasInUse);
      this.socket.on('logged', this.onLogged);
      this.socket.on('user joined', this.onUserJoined);
      this.socket.on('user left', this.onUserLeft);
      this.socket.once('users', this.onFetchUsers);

      // this.socket.emit('fetch users');
      console.log('live game socket connected....');
    } catch (err) {
      console.error(err);
    }
  }

  //#endregion

  //#region Socket Events Handlers

  private onFetchUsers = (data: LiveUserResponse) => {
    this._liveUsers.next(data.users);
  }

  private onAliasInUse = () => {
    this.aliasInUse.emit();
  };

  private onLogged = (data: LoggedResponse) => {
    this._logged = true;
    this._alias = data.alias;
    this._liveUsers.next(data.users);
  };

  private onUserJoined = (data: LiveUserResponse) => {
    this._liveUsers.next(data.users);
  };

  private onUserLeft = (data: LiveUserResponse) => {
    this._logged = false
    this._liveUsers.next(data.users);
  }

  //#endregion
}
