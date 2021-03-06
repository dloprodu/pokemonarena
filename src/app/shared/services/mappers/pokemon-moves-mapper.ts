import { PokemonMove } from '../../models/pokemon-move';
import { PokemonType } from '../../models/pokemon-type';
import { MoveCategory } from '../../models/move-category';
import { MoveDamageClass } from '../../models/move-damage-class';

import { GetPokemonMoveResponse } from '../api_contracts';

export class PokemonMoveMapper {
  static fromResponse(response: GetPokemonMoveResponse | null, iso639: string): PokemonMove | null {
    if (!response) {
      return null;
    }

    const effect = 
         response.effect_entries?.find(el => el.language.name === iso639)
      ?? response.effect_entries?.find(el => el.language.name === 'en');

    return {
      id: response.id,
      name: response.name,
      localizedName: response.names?.find(el => el.language.name === iso639)?.name,
      description: effect?.effect ?? '',
      shortDescription: effect?.short_effect ?? '',
      accuracy: response.accuracy,
      pp: response.pp,
      power: response.power,
      category: response.meta?.category?.name as MoveCategory,
      damageClass: response.damage_class?.name as MoveDamageClass,
      type: response.type?.name as PokemonType
    };
  }
}