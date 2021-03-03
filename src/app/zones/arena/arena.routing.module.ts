import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ArenaBasicPage,
  ArenaCanvasPage
} from './pages';

const routes: Routes = [
  {
    // Root container
    path: '',
    children: [
      // Pages
      { path: 'arena-basic', component: ArenaBasicPage, },
      { path: 'arena-canvas', component: ArenaCanvasPage, },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ArenaRoutingModule {
}
