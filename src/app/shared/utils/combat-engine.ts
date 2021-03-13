import { Pokemon } from '../models/pokemon';
import { PokemonMove } from '../models/pokemon-move';
import { PokemonTypeInfo } from '../models/pokemon-type-info';
import { MoveCategory } from '../models/move-category';

import { Competitor } from './competitor';

type GameModeType = '1vsCOM' | '1vs1';
type TurnOwnerType = 'player' | 'opponent';
type GameStateType = 'none' | 'initiating' | 'initiated' | 'finished';

/**
 * Class responsible for managing a combat.
 */
export class CombatEngine {
  //#region Properties

  get mode(): GameModeType {
    return this._mode;
  }

  get player(): Competitor | null {
    return this._player;
  }

  get opponent(): Competitor | null {
    return this._opponent;
  }

  get typeInfoList(): PokemonTypeInfo[] {
    return this._typeInfoList;
  }

  get turnOwner(): TurnOwnerType {
    return this._turnOwner;
  }

  get playerHasTurn(): boolean {
    return this.turnOwner === 'player';
  }

  get initiating(): boolean {
    return this._state === 'none' || this._state === 'initiating';
  }

  get initiated(): boolean {
    return this._state === 'initiated';
  }

  get finished(): boolean {
    return this._state === 'finished';
  }

  get score(): number {
    return this._score;
  }

  //#endregion

  //#region Fields

  private _mode: GameModeType = '1vsCOM';
  private _turnOwner: TurnOwnerType = 'player';
  private _player: Competitor | null = null;
  private _opponent: Competitor | null = null;
  private _typeInfoList!: PokemonTypeInfo[];
  private _state: GameStateType = 'none';
  private _score = 0;

  private _timers = {
    turnTimer: null,
    opponent1vsCOMTimer: null
  };

  /**
   * Callback that will be called when the opponent executes a movement.
   */
  public onOpponentExecutesMove?: () => void;

  /**
   * Callback that will be called when the player executed a movement.
   */
  public onPlayerExecutesMove?: () => void;

  /**
   * Callback that will be called when the combat has finished.
   */
  public onFinished?: () => void;

  //#endregion

  //#region Constructor

  constructor() {}

  //#endregion

  //#region Methods

  /**
   * Inits the combat.
   */
  public init(
    player: { pokemon: Pokemon | null, moves: PokemonMove[] },
    opponent: { pokemon: Pokemon | null, moves: PokemonMove[] },
    typeInfoList: PokemonTypeInfo[],
    mode: GameModeType = '1vsCOM'
  ) {
    if (player.pokemon == null || (mode == '1vsCOM' && opponent.pokemon == null)) {
      throw new Error('Unable to init the combat');
    }

    this._player = {
      pokemon: player.pokemon,
      level: 350,
      maxLevel: 350,
      moves: this.selectMoves(player.moves)
    };

    if (mode === '1vsCOM') {
      this._opponent = {
        pokemon: opponent.pokemon,
        level: 350,
        maxLevel: 350,
        moves: this.selectMoves(opponent.moves)
      };
    }

    this._typeInfoList = typeInfoList;
    this._turnOwner = Math.random() > 0.5 ? 'opponent' : 'player';
    this._state = this._opponent != null ? 'initiated' : 'initiating';
    this._score = 0;
    this._mode = mode;

    if (this.mode === '1vsCOM') {
      setTimeout(() => this.executeOpponentMove(), 500);
    }
  }

  public initLiveOpponent(opponent: Competitor) {
    this._opponent = opponent;

    switch (this._state) {
      case 'initiating':
        this._state = 'initiated';
        break;
      case 'none':
        this._state = 'initiating';
        break;
    }
  }

  public reset() {
    this._player = null;
    this._opponent = null;
    this._state = 'none';
    this._score = 0;
    clearTimeout(this._timers.turnTimer);
    clearTimeout(this._timers.opponent1vsCOMTimer);
  }

  /**
   * The player executes a move.
   */
  public executesMove(move: PokemonMove) {
    if (this.opponent == null || this.player == null || this.finished) {
      return;
    }

    const damage = this.calculateDamage(this.player, this.opponent, move);
    this.opponent.level = Math.max(0, this.opponent.level - damage);
    this._score += damage;

    // Notify that the player has executed the moved. That is util, for example, if the UI component wants to apply
    // some animation.
    setTimeout(() => {
      if (this.onPlayerExecutesMove == null) {
        return;
      }

      this.onPlayerExecutesMove();
    });

    // Check if the combat has finished
    if (this.opponent.level === 0) {
      this._score += this._mode === '1vsCOM' ? 1000 : 3000;
      this.finish();
      return;
    }

    // Update the turn
    this._timers.turnTimer = setTimeout(() => {
      this._turnOwner = 'opponent';

      if (this.mode === '1vsCOM') {
        this._timers.opponent1vsCOMTimer = setTimeout(() => this.executeOpponentMove(), 1000);
      }
    }, 500);
  }

  /**
   * The player receives a move.
   */
  public receiveMove(move: PokemonMove) {
    if (this.opponent == null || this.player == null || this.finished) {
      return;
    }

    const damage = this.calculateDamage(this.opponent, this.player, move);
    this.player.level = Math.max(0, this.player.level - damage);

    // Notify that the opponent has executed the moved. That is util, for example, if the UI component wants to apply
    // some animation.
    setTimeout(() => {
      if (this.onOpponentExecutesMove == null) {
        return;
      }

      this.onOpponentExecutesMove();
    });

    // Check if the combat has finished
    if (this.player.level === 0) {
      this.finish();
      return;
    }

    // Update the turn
    this._timers.turnTimer = setTimeout(() => this._turnOwner = 'player', 500);
  }

  //#endregion

  //#region Helpers

  /**
   * Calculate the damage of a movement.
   */
  private calculateDamage(from: Competitor, to: Competitor, move: PokemonMove): number {
    const moveType = this.typeInfoList.find(t => t.name === move.type);
    let dx = 1;

    if (moveType?.damageRelations?.noDamageTo?.some(t => ((to.pokemon.types ?? []).indexOf(t)) > -1)
      || moveType?.damageRelations?.noDamageFrom?.some(t => ((from.pokemon.types ?? []).indexOf(t)) > -1)) {
      dx = 0;
    }

    if (moveType?.damageRelations?.halfDamageTo?.some(t => ((to.pokemon.types ?? []).indexOf(t)) > -1)
      || moveType?.damageRelations?.halfDamageFrom?.some(t => ((from.pokemon.types ?? []).indexOf(t)) > -1)) {
      dx = 0.5;
    }

    if (moveType?.damageRelations?.doubleDamageTo?.some(t => ((to.pokemon.types ?? []).indexOf(t)) > -1)
      || moveType?.damageRelations?.doubleDamageFrom?.some(t => ((from.pokemon.types ?? []).indexOf(t)) > -1)) {
      dx = 2;
    }

    // Generate a random number as a simple way of considering the move accuracy.
    // - An accuracy of 100% always will be successful.
    // - An accuracy of 10% always will rarely be effective and it will fail.
    if (move.accuracy != null) {
      const f = Math.floor(Math.random() * 100);
      if (f > move.accuracy) {
        dx = 0;
      }
    }

    return move.power * dx;
  }

  /**
   * Finalizes the combat.
   */
  private finish() {
    this._state = 'finished';

    if (this.onFinished != null) {
      this.onFinished();
    }
  }

  /**
   * On 1 vs COM mode, executes the opponent move randomly.
   */
   private executeOpponentMove() {
    if (!this.opponent?.moves?.length) {
      return;
    }

    const selectedIndex = Math.floor(Math.random() * this.opponent.moves.length);
    this.receiveMove(this.opponent.moves[selectedIndex]);
  }

  /**
   * Selects 4 moves randomly.
   */
  private selectMoves(moves: PokemonMove[], count = 4): PokemonMove[] {
    const damageMoves = moves.filter(m => [
        MoveCategory.Damage,
        MoveCategory.DamageAndAilment,
        MoveCategory.DamageAndHeal,
        MoveCategory.DamageAndLower,
        MoveCategory.DamageAndRaise
      ].indexOf(m.category) > -1
    );
    const result: PokemonMove[] = [];

    for (let i = 0; i < Math.min(count, damageMoves.length); i++) {
      const selectedIndex = Math.floor(Math.random() * damageMoves.length);
      result.push(damageMoves[selectedIndex]);
      damageMoves.splice(selectedIndex, 1);
    }

    return result;
  }

  //#endregion
}
