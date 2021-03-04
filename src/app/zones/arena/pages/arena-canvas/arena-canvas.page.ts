import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';

import { PageComponent } from '@app/shared';

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

  ngAfterViewInit() {
    // this.canvas.nativeElement.width = 800;
    // this.canvas.nativeElement.height = 480;
  }

  //#endregion

  //#region PageComponent Methods

  public hasChanges(): boolean {
    return false;
  }

  //#endregion
}