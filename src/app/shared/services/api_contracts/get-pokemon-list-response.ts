export interface GetPokemonListResponse {
  count?: number;
  results?: { name: string, url: string }[];
}