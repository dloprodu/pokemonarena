import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import { PageComponent } from '@app/shared';

@Component({
  selector: 'page-arena-basic',
  templateUrl: 'arena-basic.page.html',
  styleUrls: ['arena-basic.page.scss']
})
export class ArenaBasicPage extends PageComponent implements OnInit, OnDestroy {
  //#region Queries

  @ViewChild('player') playerEl!: ElementRef<HTMLImageElement>;
  @ViewChild('opponent') opponentEl!: ElementRef<HTMLImageElement>;

  //#endregion

  //#region Properties

  get id(): string { return 'arena-basic-page'; }

  get pageName(): string {
    return 'Arena Basic';
  }

  //#endregion

  //#region Constructor

  constructor(
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  //#endregion

  //#region PageComponent Methods

  public hasChanges(): boolean {
    return false;
  }

  //#endregion

  //#region 

  private animateCSS(node: HTMLElement, animationName: string, callback?: () => void) {
    node.classList.add('animate__animated', animationName);

    const handleAnimationEnd = () => {
      node.classList.remove('animate__animated', animationName);
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback();
    }

    node.addEventListener('animationend', handleAnimationEnd);
  }

  //#endregion

  //#region Events Handlers

  onAttackClick() {
    this.animateCSS(this.playerEl.nativeElement, 'animate__bounce');
  }

  //#endregion
}