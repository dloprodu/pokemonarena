import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@env/environment';
import { Language } from '../models/language';

import { ContextService } from './context';

import { Observable, forkJoin } from 'rxjs';
import { mergeMap, map, } from 'rxjs/operators';

/**
 * @file PokeApiService.ts
 * @module app.share
 * @summary Poke API service.
 * @description
 *
 * @version 0.0.0
 * @copyright 2021
 */
@Injectable()
export class PokeApiService {
  //#region Const

  readonly AVAILABLE_LANG_MAP: {[key: string]: number} = {
    'ja-Hrkt': 1,
    roomaji: 2,
    ko: 3,
    'zh-Hant': 4,
    fr: 5,
    de: 6,
    es: 7,
    it: 8,
    en: 9,
    cs: 10,
    ja: 11,
    'zh-Hans': 12,
    'pt-BR': 13
  };

  //#endregion

  //#region Properties

  get pokeApi(): { baseUrl: string, defaultHeaders: { [key: string]: string } } {
    return environment.context.assets.pokeAPI;
  }

  //#endregion

  //#region Constructor

  constructor(
    private context: ContextService,
    private http: HttpClient
  ) {}

  //#endregion

  //#region Methods

  getLanguages(): Observable<Language[]> {
    const userLang = navigator.language;
    const iso639 = this.AVAILABLE_LANG_MAP[userLang] ? userLang : 'en';

    return this.http
      .get<{
        count: number,
        results: {name: string, url: string}[]
      }>(
        `${this.pokeApi.baseUrl}/language`,
        {
          headers: new HttpHeaders(this.pokeApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        mergeMap(result => {
          const requests$: Observable<Language>[] = [];
          result.body?.results?.forEach(item => {
            requests$.push( this.getLanguage(item, iso639) )
          });
          
          return forkJoin( requests$ );
        }),
      );
  }

  getLanguage(
    item: { name: string, url: string },
    iso639: string
  ): Observable<Language> {
    return this.http
      .get<{
        id: number,
        iso3166: string,
        iso639: string,
        names: {name: string, language: {name: string}}[]
      }>(
        `${this.pokeApi.baseUrl}/language/${item.name}`,
        {
          headers: new HttpHeaders(this.pokeApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => {
          const item: Language = {
            id: result.body?.id,
            code: result.body?.iso639,
            name: result.body?.names?.find(el => el.language.name === iso639)?.name ?? result.body?.iso639
          };
          return item;
        })
      );
  }

  //#endregion
}