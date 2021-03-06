import { HasId, HasName, HasDescription, HasShortDescription } from './contracts';

import { MoveCategory } from './move-category';
import { MoveDamageClass } from './move-damage-class';
import { PokemonType } from './pokemon-type';

/**
 * Pokemon battle movement.
 */
export interface PokemonMove extends HasId, HasName, HasDescription, HasShortDescription {
  /**
   * Name in the selected language.
   */
  localizedName: string;

  /**
   * The percent value of how likely this move is to be successful.
   */
  accuracy: number;

  /**
   * Power points. The number of times this move can be used.
   */
  pp: number;

  /**
   * The base power of this move with a value of 0 if it does not have a base power.
   * It helps determine how much damage they deal.
   */
  power: number;

  /**
   * The category of move this move falls under, e.g. damage or ailment.
   */
  category: MoveCategory;

  /**
   * The type of damage the move inflicts on the target, e.g. physical.
   */
  damageClass?: MoveDamageClass;

  /**
   * The elemental type of this move.
   */
  type: PokemonType;
}
