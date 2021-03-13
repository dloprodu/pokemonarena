import {
  Directive,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';

import {
  PageComponent,
  PokeApiService,
  RankingManagerService,
  LiveGameService
} from '@app/shared';
import { PokemonMove } from '@app/shared/models';

import { CombatEngine } from '@app/shared/utils/combat-engine';
import { Competitor } from '@app/shared/utils/competitor';

import { RankingTableComponent } from '../components/ranking-table/ranking-table';

import { combineLatest, of } from 'rxjs';
import { mergeMap, takeWhile } from 'rxjs/operators';

@Directive()
export abstract class ArenaBasePage extends PageComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Queries

  @ViewChild(RankingTableComponent) rankingTable?: RankingTableComponent;

  //#endregion

  //#region Fields

  public readonly combatEngine = new CombatEngine();
  public showCountdown = true;
  public abstract get userId(): string;
  public abstract get isLive(): boolean;

  //#endregion

  //#region Constructor

  constructor(
    protected location: Location,
    protected pokeApi: PokeApiService,
    protected rankingManager: RankingManagerService,
    protected live: LiveGameService
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    if (this.isLive && (!this.live.logged || !this.live.opponent)) {
      this.location.back();
      return;
    }

    this.live
      .opponentDisconnected
      .pipe(
        takeWhile(() => this.alive && this.isLive)
      ).subscribe(() => {
        alert('The opponent has left the game');
        this.location.back();
      });

    this.live
      .opponentReady
      .pipe(
        takeWhile(() => this.alive && this.isLive)
      ).subscribe((opponent: Competitor) => {
        this.combatEngine.initLiveOpponent(opponent);

        if (this.combatEngine.initiated) {
          this.onCombatEngineLoaded();
        }
      });

    this.load();
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.combatEngine?.reset();

    if (this.isLive) {
      this.live.leaveBattle();
    }
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
          console.log('<< FINISHED >>');
          this.rankingTable?.refresh();
        });
      }
    };

    // If it is a 1vs1, we dont't load the opponent data.
    // We expect to receive the opponent data from the live service.
    this.pokeApi
      .getPokemonList(500)
      .pipe(
        mergeMap(result => {
          const player1 = result[Math.floor(Math.random() * result.length)];
          const player2 = !this.isLive
            ? result[Math.floor(Math.random() * result.length)]
            : '';

          return combineLatest([
            this.pokeApi.getPokemon(player1),
            !this.isLive
              ? this.pokeApi.getPokemon(player2)
              : of(null),
          ]).pipe(
            mergeMap(([p1, p2]) => {
              return combineLatest([
                of(p1),
                this.pokeApi.getPokemonMovesList(p1?.moves ?? []),
                of(p2),
                !this.isLive
                  ? this.pokeApi.getPokemonMovesList(p2?.moves ?? [])
                  : of([]),
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
          typeInfoList,
          this.isLive ? '1vs1' : '1vsCOM'
        );

        if (this.isLive) {
          this.live.playerReady(this.combatEngine.player);
        }

        console.log(this.combatEngine.player);
        console.log(this.combatEngine.opponent);

        if (!this.isLive || this.combatEngine.initiated) {
          this.onCombatEngineLoaded();
        }
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
