export interface GetPokemonMoveResponse {
  id: number;
  name: string;
  names: {
    name: string;
    language: { name: string; url: string}
  }[];
  accuracy: number;
  power: number;
  pp: number;
  damage_class: { name: string; url: string };
  meta: {
    category: { name: string; url: string };
  };
  type: { name: string; url: string };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: { name: string; url: string}
  }[];
}