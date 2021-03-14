import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { PokeApiService, RankingManagerService, LiveGameService } from '@app/shared';
import { PokemonMove } from '@app/shared/models';

import { ArenaBasePage } from '../arena-base-page';
import { BattlefieldRender } from './battlefield-render';

@Component({
  selector: 'page-arena-canvas',
  templateUrl: 'arena-canvas.page.html',
  styleUrls: ['arena-canvas.page.scss']
})
export class ArenaCanvasPage extends ArenaBasePage implements OnInit, OnDestroy, AfterViewInit  {
  //#region Queries

  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;

  //#endregion

  //#region BasePage Properties

  get id(): string { return 'arena-canvas-page'; }

  get pageName(): string {
    return 'Arena Canvas';
  }

  //#endregion

  //#region ArenaBasePage Properties

  get alias(): string {
    return this._alias;
  }

  get isLive(): boolean {
    return this._isLive;
  }

  //#endregion

  //#region Fields

  private _alias: string;
  private _isLive: boolean;
  private render?: BattlefieldRender;

  //#endregion

  //#region Constructor

  constructor(
    location: Location,
    pokeApi: PokeApiService,
    rankingManager: RankingManagerService,
    live: LiveGameService,
    private route: ActivatedRoute
  ) {
    super(location, pokeApi, rankingManager, live);

    this.combatEngine.onOpponentExecutesMove = () => {
      if (!this.alive) {
        return;
      }

      this.render?.animateOpponent(() => this.render?.invalidatePlayerLevel(this.combatEngine.player));
    };

    this.combatEngine.onPlayerExecutesMove = () => {
      if (!this.alive) {
        return;
      }

      this.render?.animatePlayer(() => this.render?.invalidateOpponentLevel(this.combatEngine.opponent));
    };
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    this._alias = this.route.snapshot.queryParams.userId;
    this._isLive = this.route.snapshot.queryParams.live === 'true';

    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.render = new BattlefieldRender(this.canvas.nativeElement);
    this.render.init();
  }

  //#endregion

  //#region PageComponent Methods

  public hasChanges(): boolean {
    return false;
  }

  //#endregion

  //#region ArenaBasePage Methods

  protected onCombatEngineLoaded(): void {
    super.onCombatEngineLoaded();
    this.render?.init({ player: this.combatEngine.player, opponent: this.combatEngine.opponent });
  }

  //#endregion

  //#region Events Handlers

  onReload() {
    super.onReload();
  }

  onCountdownReady() {
    super.onCountdownReady();
  }

  onAttackClick(move: PokemonMove) {
    super.onAttackClick(move);
  }

  //#endregion
}
