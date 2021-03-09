export const environment = {
  production: false,
  context: {
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
      gameAPI: {
        baseUrl: 'http://localhost:3000',
        defaultHeaders: {
          'Content-Type': 'application/json'
        },
      },
      translations: {
        baseUrl: '/assets/i18n',
      }
    },
  },
};