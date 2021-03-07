import { Pokemon } from '../models/pokemon';
import { PokemonMove } from '../models/pokemon-move';

export interface Competitor {
  level: number;
  maxLevel: number;
  pokemon: Pokemon;
  moves: PokemonMove[];
}
