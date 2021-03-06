import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@env/environment';

import { Language } from '../models/language';
import { Pokemon } from '../models/pokemon';
import { PokemonTypeInfo } from '../models/pokemon-type-info';
import { PokemonMove } from '../models/pokemon-move';

import { ContextService } from './context';
import {
  GetLanguageListResponse,
  GetLanguageResponse,
  GetPokemonListResponse,
  GetPokemonResponse,
  GetPokemonMoveResponse,
  GetPokemonTypeListResponse,
  GetPokemonTypeResponse
} from './api_contracts';

import {
  PokemonMapper,
  PokemonMoveMapper,
  PokemonTypeMapper
} from './mappers';

import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';

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

  //#region Fields

  /**
   * Represents a basic memory cache.
   * In a real project we should use something more sophisticated like the Service Worker API with the Cache API (for example).
   */
  readonly cache: {[key: string]: any} = {};

  //#endregion

  //#region Constructor

  constructor(
    private context: ContextService,
    private http: HttpClient
  ) {}

  //#endregion

  //#region Methods

  /**
   * Returns the pokeAPI available languages.
   */
  getLanguageList(): Observable<Language[]> {
    const userLang = navigator.language;
    const iso639 = this.AVAILABLE_LANG_MAP[userLang] ? userLang : 'en';
    const url = `${this.pokeApi.baseUrl}/language`;

    if (this.cache[url]) {
      return of(this.cache[url]);
    }

    return this.http
      .get<GetLanguageListResponse>(
        url,
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
        tap(data => this.cache[url] = data)
      );
  }

  /**
   * Returns the language data located in the given iso639.
   */
  getLanguage(
    item: { name: string, url: string },
    iso639: string
  ): Observable<Language> {
    return this.http
      .get<GetLanguageResponse>(
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

  /**
   * Returns the complete pokemon list.
   */
  getPokemonList(limit = 100, offset = 0): Observable<string[]> {
    const url = `${this.pokeApi.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;

    if (this.cache[url]) {
      return of(this.cache[url]);
    }

    return this.http
      .get<GetPokemonListResponse>(
        url,
        {
          headers: new HttpHeaders(this.pokeApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => result?.body?.results?.map(el => el.name ?? '') ?? []),
        tap(data => this.cache[url] = data)
      );
  }

  /**
   * Returns the specific data for the given pokemon.
   */
  getPokemon(pokemon: string | number): Observable<Pokemon | null> {
    const url = `${this.pokeApi.baseUrl}/pokemon/${pokemon}`;

    if (this.cache[url]) {
      return of(this.cache[url]);
    }

    return this.http
      .get<GetPokemonResponse>(
        url,
        {
          headers: new HttpHeaders(this.pokeApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => PokemonMapper.fromResponse(result?.body)),
        tap(data => this.cache[url] = data)
      );
  }

  /**
   * Returns the pokemon move list.
   */
  getPokemonMovesList(moves: string[] | number[]): Observable<PokemonMove[]> {
    if (!moves?.length) {
      return of([]);
    }

    const requests$: Observable<PokemonMove | null>[] = [];
    moves.forEach((move: string | number) => requests$.push( this.getPokemonMove(move) ) )

    return forkJoin( requests$ )
      .pipe(
        map(result => result.filter(el => el != null) as PokemonMove[])
      )
  }

  /**
   * Returns the specific data for the given move.
   */
  getPokemonMove(move: string | number): Observable<PokemonMove | null> {
    const url = `${this.pokeApi.baseUrl}/move/${move}`;
    const lang = this.context.instance.language;

    if (this.cache[url]) {
      return of(this.cache[url]);
    }

    return this.http
      .get<GetPokemonMoveResponse>(
        url,
        {
          headers: new HttpHeaders(this.pokeApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => PokemonMoveMapper.fromResponse(result?.body, lang)),
        tap(data => this.cache[url] = data)
      );
  }

  /**
   * Returns the type info list with the damage relation for each one.
   */
  getPokemonTypeInfoList(): Observable<PokemonTypeInfo[]> {
    const url = `${this.pokeApi.baseUrl}/type`;

    if (this.cache[url]) {
      return of(this.cache[url]);
    }

    return this.http
      .get<GetPokemonTypeListResponse>(
        url,
        {
          headers: new HttpHeaders(this.pokeApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        mergeMap(result => {
          if (!result.body?.results?.length) {
            return of([]);
          }

          const requests$: Observable<PokemonTypeInfo | null>[] = [];
          result.body.results.forEach(type => requests$.push( this.getPokemonTypeInfo(type.name) ) )

          return forkJoin( requests$ );
        }),
        map(result => result.filter(el => el != null) as PokemonTypeInfo[]),
        tap(data => this.cache[url] = data)
      );
  }

  /**
   * Returns the specific type data for the given type.
   */
  getPokemonTypeInfo(type: string | number): Observable<PokemonTypeInfo | null> {
    const url = `${this.pokeApi.baseUrl}/type/${type}`;
    const lang = this.context.instance.language;

    if (this.cache[url]) {
      return of(this.cache[url]);
    }

    return this.http
      .get<GetPokemonTypeResponse>(
        url,
        {
          headers: new HttpHeaders(this.pokeApi.defaultHeaders),
          observe: 'response'
        }
      ).pipe(
        map(result => PokemonTypeMapper.fromResponse(result?.body, lang)),
        tap(data => this.cache[url] = data)
      );
  }

  //#endregion
}