import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LanguageGuard } from './guards/language-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ LanguageGuard ],
    children: [
      {
        path: ':language',
        canActivate: [ LanguageGuard ],
        children: [
          { path: '', redirectTo: 'setup', pathMatch: 'full' },
          {
            path: '',
            loadChildren: () => import('../zones/anonymous/anonymous.module').then(m => m.AnonymousModule),
          },
          {
            path: 'arena',
            loadChildren: () => import('../zones/arena/arena.module').then(m => m.ArenaModule),
          },
          // Wildcard route (TODO: implement No Found Page)
          // { path: '**', component: NotFoundPage }
          { path: '**', redirectTo: 'setup' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}

