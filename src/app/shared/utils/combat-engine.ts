import { PokemonMove } from '../models/pokemon-move';
import { PokemonTypeInfo } from '../models/pokemon-type-info';

import { Competitor } from './competitor';

/**
 * Class responsible for managing a combat.
 */
export class CombatEngine {

  //#region Constructor

  constructor(
    readonly player: Competitor,
    readonly opponent: Competitor,
    readonly typeInfoList: PokemonTypeInfo[]
  ) {}

  //#endregion

  //#region Methods

  /**
   * The player executes a move.
   */
  public executesMove(move: PokemonMove) {
    this.opponent.level = Math.max(0, this.opponent.level - this.calculateDamage(this.player, this.opponent, move));
  }

  /**
   * The player receives a move.
   */
  public receiveMove(move: PokemonMove) {
    this.player.level = Math.max(0, this.player.level - this.calculateDamage(this.opponent, this.player, move));
  }

  //#endregion

  //#region Helpers

  /**
   * Calculate the damage of a movement.
   */
  private calculateDamage(from: Competitor, to: Competitor, move: PokemonMove): number {
    const moveType = this.typeInfoList.find(t => t.name === move.name);
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
    const f = Math.floor(Math.random() * 100);
    if (f <= move.accuracy) {
      dx = 0;
    }

    return move.power * dx;
  }

  //#endregion
}