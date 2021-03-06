import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@env/environment';
import { SharedModule } from '@app/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app';
import { LanguageGuard } from './guards';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [LanguageGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }


/**
 * Creates a TranslateHttpLoader.
 *
 * @export
 * @param http The HTTP client.
 * @returns A TranslateHttpLoader instance.
 */
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.context.assets.translations.baseUrl + '/', `.json`);
}
