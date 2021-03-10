import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

import { BaseComponent } from '@app/shared';
import { PokemonMove } from '@app/shared/models';
import { CombatEngine } from '@app/shared/utils/combat-engine';

/**
 * Move picker component.
 */
@Component({
  selector: 'move-picker',
  templateUrl: 'move-picker.html',
  styleUrls: ['move-picker.scss'],
})
export class MovePickerComponent extends BaseComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {

  //#region Input

  @Input() combatEngine: CombatEngine;

  //#endregion

  //#region Outputs

  @Output() readonly reloadClick = new EventEmitter();
  @Output() readonly attackClick = new EventEmitter<PokemonMove>();

  //#endregion

  //#region Constructor

  constructor() {
    super();
  }

  //#endregion

  //#region Lifecycle Hooks

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  //#endregion

  //#region Events Handlers

  onReload() {
    this.reloadClick.emit();
  }

  onAttackClick(move: PokemonMove) {
    this.attackClick.emit(move);
  }

  //#endregion
}
