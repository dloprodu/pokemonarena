import {
  Directive,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { PageComponent, PokeApiService, RankingManagerService } from '@app/shared';
import { PokemonMove } from '@app/shared/models';

import { CombatEngine } from '@app/shared/utils/combat-engine';

import { combineLatest, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Directive()
export abstract class ArenaBasePage extends PageComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Fields

  public readonly combatEngine = new CombatEngine();
  public showCountdown = true;
  public abstract get userId(): string;

  //#endregion

  //#region Constructor

  constructor(
    protected pokeApi: PokeApiService,
    protected rankingManager: RankingManagerService
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    this.load();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  //#endregion

  //#region PageComponent Methods

  public hasChanges(): boolean {
    return false;
  }

  //#endregion

  //#region Methods

  protected load() {
    this.showCountdown = true;
    this.combatEngine.reset();
    this.combatEngine.onFinished = () => {
      // Save score
      if (this.userId) {
        this.rankingManager.recordScore(
          this.userId,
          this.combatEngine.score,
          this.combatEngine.player.pokemon.name
        ).subscribe(res => {
          console.log(res);
        });
      }
    };

    this.pokeApi
      .getPokemonList(1000)
      .pipe(
        mergeMap(result => {
          const player1 = result[Math.floor(Math.random() * result.length)];
          const player2 = result[Math.floor(Math.random() * result.length)];

          return combineLatest([
            this.pokeApi.getPokemon(player1),
            this.pokeApi.getPokemon(player2),
          ]).pipe(
            mergeMap(([p1, p2]) => {
              return combineLatest([
                of(p1),
                this.pokeApi.getPokemonMovesList(p1?.moves ?? []),
                of(p2),
                this.pokeApi.getPokemonMovesList(p2?.moves ?? []),
                this.pokeApi.getPokemonTypeInfoList()
              ]);
            })
          );
        })
      )
      .subscribe(([ p1, m1, p2, m2, typeInfoList ]) => {
        this.combatEngine.init(
          { pokemon: p1, moves: m1 },
          { pokemon: p2, moves: m2 },
          typeInfoList
        );

        console.log(this.combatEngine.player);
        console.log(this.combatEngine.opponent);

        this.onCombatEngineLoaded();
      }, err => {
        console.error(err);
      });
  }

  /**
   * Abstract method that will be called when the combat data are ready to start the game.
   */
  protected abstract onCombatEngineLoaded(): void;

  //#endregion

  //#region Events Handlers

  onReload() {
    this.load();
  }

  onCountdownReady() {
    this.showCountdown = false;
  }

  onAttackClick(move: PokemonMove) {
    this.combatEngine.executesMove(move);
  }

  //#endregion
}
