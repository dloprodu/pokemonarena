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
import { User, PokemonMove } from '@app/shared/models';

import { CombatEngine } from '@app/shared/utils/combat-engine';
import { Competitor } from '@app/shared/utils/competitor';

import { RankingTableComponent } from '../components/ranking-table/ranking-table';

import { Observable, combineLatest, of } from 'rxjs';
import { mergeMap, takeWhile, timeout } from 'rxjs/operators';

@Directive()
export abstract class ArenaBasePage extends PageComponent implements OnInit, OnDestroy, AfterViewInit {
  //#region Queries

  @ViewChild(RankingTableComponent) rankingTable?: RankingTableComponent;

  //#endregion

  //#region Fields

  public user: User;
  public readonly combatEngine = new CombatEngine();
  public showCountdown = true;
  public abstract get alias(): string;
  public abstract get isLive(): boolean;

  //#endregion

  //#region Constructor

  constructor(
    protected location: Location,
    protected pokeApi: PokeApiService,
    protected rankingManager: RankingManagerService,
    public live: LiveGameService
  ) {
    super();

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

    this.live
      .reloadBattleRequest
      .pipe(
        takeWhile(() => this.alive && this.isLive)
      ).subscribe(() => {
        this.load();
      });

    this.live
      .timeout
      .pipe(
        takeWhile(() => this.alive && this.isLive)
      ).subscribe(() => {
        this.combatEngine.loseTurn();
      });

    this.live
      .moveReceived
      .pipe(
        takeWhile(() => this.alive && this.isLive)
      ).subscribe((index) => {
        if (index != null) {
          this.combatEngine.receiveMove(this.combatEngine.opponent.moves[index]);
        } else {
          this.combatEngine.takeTurn();
        }

        if (!this.combatEngine.finished) {
          this.live.initTurnTimer();
        }
      });
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    // If it's a live game and player not logged and not opponent data
    // then, return to the setup page.
    if (this.isLive && (!this.live.logged || !this.live.opponent)) {
      this.location.back();
      return;
    }

    this.load();
    this.loadUser();
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.combatEngine?.reset();
    this.live.stopTimer();

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
      if (this.user) {
        this.rankingManager.recordScore(
          this.user.id,
          this.combatEngine.score,
          this.combatEngine.player.pokemon.name
        ).subscribe(res => {
          console.log('<< FINISHED >>');
          this.rankingTable?.refresh();
        });
      }
    };

    // If it is a 1vs1, we don't load the opponent data.
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
          this.isLive
            ? '1vs1'
            : '1vsCOM',
          this.live.initialTurnOwner === this.live.alias
            ? 'player'
            : 'opponent'
        );

        if (this.isLive) {
          // In a live battle, send the player data to the opponent
          this.live.playerReady(this.combatEngine.player);
        }

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
  protected onCombatEngineLoaded(): void {
    if (this.isLive && this.combatEngine.playerHasTurn) {
      this.live.initTurnTimer();
    }
  }

  //#endregion

  //#region Helpers

  private loadUser() {
    this.rankingManager
      .getUser(this.isLive ? this.live.alias : this.alias)
      .pipe(
        mergeMap(user => {
          if (user == null) {
            return this.rankingManager.createUser(this.alias);
          }

          return of(user);
        }),
        timeout(10000)
      ).subscribe(user => this.user = user);
  }

  //#endregion

  //#region Events Handlers

  onReload() {
    // If showCountdown true, the game is already loading...
    if (this.showCountdown) {
      return;
    }

    if (this.isLive) {
      this.live.reloadBattle();
    }

    this.load();
  }

  onCountdownReady() {
    this.showCountdown = false;
  }

  onAttackClick(move: PokemonMove) {
    if (this.isLive) {
      this.live.sendMove(this.combatEngine.player.moves.indexOf(move));
    }

    this.combatEngine.executesMove(move);
  }

  //#endregion
}
