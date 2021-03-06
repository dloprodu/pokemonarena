import { Pokemon } from '../../models/pokemon';
import { PokemonType } from '../../models/pokemon-type';
import { GetPokemonResponse } from '../api_contracts';

export class PokemonMapper {
  static fromResponse(response: GetPokemonResponse | null): Pokemon | null {
    if (!response) {
      return null;
    }

    return {
      id: response.id,
      name: response.name,
      order: response.order,
      types: response.types?.map<PokemonType>(el => el.type.name as PokemonType ),
      height: response.height,
      weight: response.weight,
      sprites: {
        back: response.sprites.back_default,
        front: response.sprites.front_default
      },
      moves: response.moves?.map(m => m.move.name)
    };
  }
}