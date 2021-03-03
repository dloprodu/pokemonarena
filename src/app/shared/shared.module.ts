import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as services from './services';

const servicesList = [
  services.ContextService,
  services.StorageService,
  services.PokeApiService,
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
    RouterModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        ...servicesList,
      ]
    };
  }
}
