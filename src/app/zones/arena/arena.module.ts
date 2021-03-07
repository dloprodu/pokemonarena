import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { ArenaRoutingModule } from './arena.routing.module';

import * as pages from './pages';
import * as components from './components';

const componentsList = [
  components.CountdownComponent,
  components.GameResultPanelComponent,
];

const pagesList = [
  pages.ArenaBasicPage,
  pages.ArenaCanvasPage,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // App
    SharedModule,

    // Rest of routes
    ArenaRoutingModule,
  ],
  declarations: [
    ...pagesList,
    ...componentsList,
  ],
})
export class ArenaModule {
}
