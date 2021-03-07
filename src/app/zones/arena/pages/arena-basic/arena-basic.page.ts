import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import { PokeApiService } from '@app/shared';
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

  //#endregion

  //#region Constructor

  constructor(
    pokeApi: PokeApiService
  ) {
    super(pokeApi);

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
