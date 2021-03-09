import { GameBaseDataResponse } from './game-base-data-response';

export interface GameBasePaginatedResponse<T> extends GameBaseDataResponse<T> {
  total: number;
}