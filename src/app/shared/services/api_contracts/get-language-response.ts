export interface GetLanguageResponse {
  id: number;
  iso3166: string;
  iso639: string;
  names: {name: string, language: {name: string}}[];
}
