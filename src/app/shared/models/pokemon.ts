import { HasId, HasName, HasOrder } from './contracts';

import { PokemonType } from './pokemon-type';

/**
 * Class that represents the main data of a Pokemon.
 */
export interface Pokemon extends HasId, HasName, HasOrder {
  types: PokemonType[];
  sprites: {
    back?: string;
    front?: string;
  },
  height: number;
  weight: number;
  moves: string[];
}