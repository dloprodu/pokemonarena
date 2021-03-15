# PokemonArena

[URL: https://pokearenaweb.azurewebsites.net](https://pokearenaweb.azurewebsites.net/) 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Short description

Proof of Concept of a basic pokemon battle simulator.

It is implemented using the Angular web framework (v11). The project is divided into three modules.

### 1. Bootstrap module

This module is the start-up module. Initializes the app, configures the i18n service, etc.
Also defines a guard that will observe the navigation and check that the route contains a valid language, in another case, it will select a default language.

### 2. Shared module

The shared module defines the main services and models of the app.
It defines the APIs request/response contracts, the local models, and the mappers that transform the API contracts to the app models.
Also defines a service for each API with which it has to interact.

1. PokeApiService
It's responsible for retrieve the pokemon data needed for the game.

2. RankingManagerService
It's responsible for register and restores the user's rankings.

3. LiveService
It's responsible for sync two players in a live battle.

Other service needed to manage the application.

4. ContextService.
Keep the app configuration data (language, etc).

5. ThemeManager
It manages the app theme (dark or light). To simplify, it adds classes to the `body´ to change the theme.

6. StorageService
It's a wrapper of the local storage or session storage to keep the last selected settings.

Another important class defined is `CombatEngine` responsible for managing a battle, calculate the damage, and checking
the different game states.

### 3. Zones / Anonymous

This module defines the page to setup the game.

### 4. Zones / Arena

This module defines two pages. One to render the game on HTML and another one to render the game on Canvas.