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

@Component({
  selector: 'page-arena-basic',
  templateUrl: 'arena-basic.page.html',
  styleUrls: ['arena-basic.page.scss']
})
export class ArenaBasicPage extends ArenaBasePage implements OnInit, OnDestroy, AfterViewInit  {
  //#region Queries

  @ViewChild('player') playerEl!: ElementRef<HTMLImageElement>;
  @ViewChild('playerDetail') playerDetailEl!: ElementRef<HTMLImageElement>;
  @ViewChild('opponent') opponentEl!: ElementRef<HTMLImageElement>;
  @ViewChild('opponentDetail') opponentDetailEl!: ElementRef<HTMLImageElement>;

  //#endregion

  //#region Properties

  get id(): string { return 'arena-basic-page'; }

  get pageName(): string {
    return 'Arena Basic';
  }

  get userId(): string {
    return this._userId;
  }

  //#endregion

  //#region Fields

  private _userId;

  //#endregion

  //#region Constructor

  constructor(
    pokeApi: PokeApiService,
    rankingManager: RankingManagerService,
    private route: ActivatedRoute
  ) {
    super(pokeApi, rankingManager);

    this.combatEngine.onOpponentExecutesMove = () => {
      this.animateCSS(this.opponentEl.nativeElement, 'animate__bounce');

      this.playerDetailEl.nativeElement.classList.add('damage');
      setTimeout(() => this.playerDetailEl.nativeElement.classList.remove('damage'), 500);
    };

    this.combatEngine.onPlayerExecutesMove = () => {
      this.animateCSS(this.playerEl.nativeElement, 'animate__bounce');

      this.opponentDetailEl.nativeElement.classList.add('damage');
      setTimeout(() => this.opponentDetailEl.nativeElement.classList.remove('damage'), 500);
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
  }

  //#endregion

  //#region ArenaBasePage Methods

  protected onCombatEngineLoaded(): void {
    /* Empty */
  }

  //#endregion

  //#region Helpers

  private animateCSS(node: HTMLElement, animationName: string, callback?: () => void) {
    node.classList.add('animate__animated', animationName);

    const handleAnimationEnd = () => {
      node.classList.remove('animate__animated', animationName);
      node.removeEventListener('animationend', handleAnimationEnd);

      if (typeof callback === 'function') {
        callback();
      }
    };

    node.addEventListener('animationend', handleAnimationEnd);
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
