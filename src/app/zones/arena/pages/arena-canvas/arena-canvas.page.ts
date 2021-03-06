import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';

import { PageComponent, PokeApiService } from '@app/shared';

import { BattlefieldRender } from './battlefield-render';

@Component({
  selector: 'page-arena-canvas',
  templateUrl: 'arena-canvas.page.html',
  styleUrls: ['arena-canvas.page.scss']
})
export class ArenaCanvasPage extends PageComponent implements OnInit, OnDestroy, AfterViewInit {
  //#region Queries

  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;

  //#endregion

  //#region Properties

  get id(): string { return 'arena-canvas-page'; }

  get pageName(): string {
    return 'Arena Canvas';
  }

  //#endregion

  //#region Fields

  private render?: BattlefieldRender;

  //#endregion

  //#region Constructor

  constructor(
    private pokeApi: PokeApiService
  ) {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();

    this.pokeApi
      .getPokemonList(1000)
      .subscribe(result => {
        console.log(result);
      }, err => {
        console.error(err);
      });

    this.pokeApi
      .getPokemonMovesList(['mega-punch', 'pay-day', 'thunder-punch'])
      .subscribe(result => {
        console.log(result);
      }, err => {
        console.error(err);
      });

    this.pokeApi
      .getPokemonTypeInfoList()
      .subscribe(result => {
        console.log(result);
      }, err => {
        console.error(err);
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    // this.canvas.nativeElement.width = 800;
    // this.canvas.nativeElement.height = 480;
    this.render = new BattlefieldRender(this.canvas.nativeElement);
    this.render.init();
  }

  //#endregion

  //#region PageComponent Methods

  public hasChanges(): boolean {
    return false;
  }

  //#endregion

  //#region Events Handlers

  onAttackClick() {
    this.render?.animatePlayer();
  }

  //#endregion
}