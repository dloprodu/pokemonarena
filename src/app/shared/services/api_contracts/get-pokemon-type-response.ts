export interface GetPokemonTypeResponse {
  id: number;
  name: string;
  names: {
    name: string;
    language: { name: string; url: string }
  }[];
  damage_relations: {
    no_damage_to?: { name: string; url: string }[];
    half_damage_to?: { name: string; url: string }[];
    double_damage_to?: { name: string; url: string }[];
    no_damage_from?: { name: string; url: string }[];
    half_damage_from?: { name: string; url: string }[];
    double_damage_from?: { name: string; url: string }[];
  };
}