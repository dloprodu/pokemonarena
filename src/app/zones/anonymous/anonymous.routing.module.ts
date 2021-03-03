import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  SetupPage
} from './pages';

const routes: Routes = [
  {
    // Root container
    path: '',
    children: [
      // Pages
      { path: 'setup', component: SetupPage, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class AnonymousRoutingModule {
}
