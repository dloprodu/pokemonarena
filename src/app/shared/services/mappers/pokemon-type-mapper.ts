import { PokemonTypeInfo } from '../../models/pokemon-type-info';
import { PokemonType } from '../../models/pokemon-type';
import { GetPokemonTypeResponse } from '../api_contracts/get-pokemon-type-response';

export class PokemonTypeMapper {
  static fromResponse(response: GetPokemonTypeResponse | null, iso639: string): PokemonTypeInfo | null {
    if (!response) {
      return null;
    }

    return {
      id: response.id,
      name: response.name,
      localizedName: response.names?.find(el => el.language.name === iso639)?.name,
      damageRelations: {
        noDamageFrom: response.damage_relations?.no_damage_from?.map<PokemonType>(el => el.name as PokemonType),
        noDamageTo: response.damage_relations?.no_damage_to?.map<PokemonType>(el => el.name as PokemonType),
        halfDamageFrom: response.damage_relations?.half_damage_from?.map<PokemonType>(el => el.name as PokemonType),
        halfDamageTo: response.damage_relations?.half_damage_to?.map<PokemonType>(el => el.name as PokemonType),
        doubleDamageFrom: response.damage_relations?.double_damage_from?.map<PokemonType>(el => el.name as PokemonType),
        doubleDamageTo: response.damage_relations?.double_damage_to?.map<PokemonType>(el => el.name as PokemonType),
      }
    };
  }
}
