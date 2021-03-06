import { HasId, HasName } from './contracts';

import { TypeRelations } from './type-relations';

export interface PokemonTypeInfo extends HasId, HasName {
  /**
   * Name in the selected language.
   */
  localizedName?: string;
  damageRelations?: TypeRelations;
}
