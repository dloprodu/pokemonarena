import { APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContextService, StorageService, PokeApiService } from './services';

const servicesList = [
  ContextService,
  StorageService,
  PokeApiService,
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
  ],
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
