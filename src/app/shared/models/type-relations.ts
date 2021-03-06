import { PokemonType } from './pokemon-type';

/**
 * Class that represents the main data of the type damage relations.
 */
export interface TypeRelations {
  /**
   * A list of types that have no effect on this type.
   */
  noDamageFrom?: PokemonType[];
  /**
   * A list of types this type has no effect on.
   */
  noDamageTo?: PokemonType[];
  /**
   * A list of types that are not very effective against this type.
   */
  halfDamageFrom?: PokemonType[];
  /**
   * A list of types this type is not very effect against.
   */
  halfDamageTo?: PokemonType[];
  /**
   * A list of types that are very effective against this type.
   */
  doubleDamageFrom?: PokemonType[];
  /**
   * A list of types this type is very effect against.
   */
  doubleDamageTo?: PokemonType[];
}