import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';

import { AnonymousRoutingModule } from './anonymous.routing.module';

import * as pages from './pages';


const pagesList = [
  pages.SetupPage,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // App
    SharedModule,

    // Rest of routes
    AnonymousRoutingModule,
  ],
  declarations: [
    ...pagesList
  ],
})
export class AnonymousModule {
}
