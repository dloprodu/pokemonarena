import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';

import { BaseComponent } from '@app/shared';

/**
 * Countdown component.
 */
@Component({
  selector: 'countdown',
  templateUrl: 'countdown.html',
  styleUrls: ['countdown.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownComponent extends BaseComponent implements OnChanges, OnInit, OnDestroy, AfterViewInit {

  //#region Outputs

  @Output() readonly ready = new EventEmitter();

  //#endregion

  //#region Constructor

  constructor(
    private el: ElementRef<HTMLDivElement>
  ) {
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

    setTimeout(() => {
      this.el.nativeElement.style.display = 'none';
      this.ready.emit();
    }, 4500);
  }

  //#endregion
}
