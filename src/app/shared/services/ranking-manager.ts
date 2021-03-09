import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@env/environment';

import { User } from '../models/user';
import { RankingItem } from '../models/ranking-item';
import {
  GameBaseDataResponse,
  GameBasePaginatedResponse,
  GetRankingResponse,
  GetUserResponse
} from './game_api_contracts';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * @file RankingManagerService.ts
 * @summary Ranking API service.
 * @description
 *
 * @version 0.0.0
 * @copyright 2021
 */
@Injectable()
export class RankingManagerService {
  //#region Const

  //#endregion

  //#region Properties

  get gameApi(): { baseUrl: string, defaultHeaders: { [key: string]: string } } {
    return environment.context.assets.gameAPI;
  }

  //#endregion

  //#region Constructor

  constructor(
    private http: HttpClient
  ) {}

  //#endregion

  //#region Methods

  /**
   * Get the user by its alias.
   */
  getUser(alias: string): Observable<User> {
    const url = `${this.gameApi.baseUrl}/users/${alias?.trim()}`;

    return this.http
      .get<GameBaseDataResponse<GetUserResponse>>(
        url,
        {
          headers: new HttpHeaders(this.gameApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => {
          if (result.body?.data == null) {
            return null;
          }

          return {
            id: result.body.data._id,
            alias: result.body.data.alias
          } as User;
        }),
        catchError(_ => of(null))
      );
  }

  /**
   * Given the alias, creates an user.
   */
  createUser(alias: string): Observable<User> {
    const url = `${this.gameApi.baseUrl}/users/create`;
    
    return this.http
      .post<GameBaseDataResponse<GetUserResponse>>(
        url,
        { alias },
        {
          headers: new HttpHeaders(this.gameApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => {
          if (result.body?.data == null) {
            return null;
          }

          return {
            id: result.body.data._id,
            alias: result.body.data.alias
          } as User;
        }),
        catchError(_ => of(null))
      );
  }

  /**
   * Returns the ranking.
   */
  getRanking(
    filter?: { userId?: string },
  ): Observable<RankingItem[]> {
    const searchParams = new URLSearchParams();

    if (filter.userId) {
      searchParams.append('scoredBy', filter.userId)
    }

    return this.http
      .get<GameBasePaginatedResponse<GetRankingResponse[]>>(
        `${this.gameApi.baseUrl}/ranking/find?${ searchParams.toString() }`,
        {
          headers: new HttpHeaders(this.gameApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map((result) => {
          return result.body?.data?.map(r => (<RankingItem>{
            id: r._id,
            score: r.score,
            scoredBy: {
              id: r.scoredBy._id,
              alias: r.scoredBy.alias
            },
            pokemon: r.pokemon
          })) ?? [];
        })
      );
  }

  /**
   * Records the score.
   */
  recordScore(userId: string, score: number, pokemon: string) {
    const url = `${this.gameApi.baseUrl}/ranking/add`;
    
    return this.http
      .post<GameBaseDataResponse<GetRankingResponse>>(
        url,
        { 
          scoredBy: userId,
          score: score,
          pokemon: pokemon
        },
        {
          headers: new HttpHeaders(this.gameApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => {
          if (result.body?.data == null) {
            return null;
          }

          return <RankingItem>{
            id: result.body.data._id,
            score: result.body.data.score,
            scoredBy: {
              id: result.body.data.scoredBy._id,
              alias: result.body.data.scoredBy.alias
            },
            pokemon: result.body.data.pokemon
          };
        }),
        catchError(_ => of(null))
      );
  }

  //#endregion
}
