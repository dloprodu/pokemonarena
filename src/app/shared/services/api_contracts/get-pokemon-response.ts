export interface GetPokemonResponse {
  id: number;
  name: string;
  order: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    front_female: string;
    front_shiny_female: string;
    back_default: string;
    back_shiny: string;
    back_female: string;
    back_shiny_female: string;
  };
  moves: { move: { name: string; url: string } }[];
  types: { slot: number; type: { name: string, url: string} }[];
}
