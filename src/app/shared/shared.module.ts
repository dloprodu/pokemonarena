import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ContextService, StorageService, PokeApiService, ThemeManagerService, RankingManagerService } from './services';

const servicesList = [
  ContextService,
  StorageService,
  PokeApiService,
  RankingManagerService,
  ThemeManagerService
];

/**
 * AppCommonModule defines common features shared by
 * MDP apps.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [
    TranslateModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        ...servicesList,
        // APP_INITIALIZER
        {
          provide: APP_INITIALIZER,
          useFactory: CoreInitializer,
          deps: [ContextService],
          multi: true
        },
        {
          provide: APP_INITIALIZER,
          useFactory: ThemeInitializer,
          deps: [ThemeManagerService],
          multi: true
        },
      ]
    };
  }
}


export function CoreInitializer(context: ContextService) {
  const fn = async () => {
    context.load();
  };

  return fn;
}



export function ThemeInitializer(theme: ThemeManagerService) {
  const fn = async () => {
    theme.load();
  };

  return fn;
}
