import { GameBaseResponse } from './game-base-response';

export interface GameBaseDataResponse<T> extends GameBaseResponse {
  data: T | null;
}
