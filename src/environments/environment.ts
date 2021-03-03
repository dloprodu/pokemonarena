// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,context: {
    auth: {
      baseUrl: 'TODO',
      defaultHeaders: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      lifetime: 90,
      autoRefresh: false,
      checkInterval: 15,
      timeout: 30,
      idleTimeout: 0, // idle time control disabled
      loginPage: 'login',
      homePage: null // We manage the home login manually
    },
    language: '',
    defaultLanguage: 'en',
    environment: 'local',
    assets: {
      pokeAPI: {
        baseUrl: 'https://pokeapi.co/api/v2',
        defaultHeaders: {
          'Content-Type': 'application/json'
        },
      },
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
