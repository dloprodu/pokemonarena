import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { PokeApiService, RankingManagerService } from '@app/shared';
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

  //#region Properties

  get id(): string { return 'arena-canvas-page'; }

  get pageName(): string {
    return 'Arena Canvas';
  }

  get userId(): string {
    return this._userId;
  }

  //#endregion

  //#region Fields

  private _userId;
  private render?: BattlefieldRender;

  //#endregion

  //#region Constructor

  constructor(
    pokeApi: PokeApiService,
    rankingManager: RankingManagerService,
    private route: ActivatedRoute
  ) {
    super(pokeApi, rankingManager);

    this.combatEngine.onOpponentExecutesMove = () => {
      this.render?.animateOpponent(() => this.render?.invalidatePlayerLevel(this.combatEngine.player));
    };

    this.combatEngine.onPlayerExecutesMove = () => {
      this.render?.animatePlayer(() => this.render?.invalidateOpponentLevel(this.combatEngine.opponent));
    };
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    this._userId = this.route.snapshot.queryParams.userId;
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
