import { User } from './user';

export interface RankingItem {
  id: string;
  score: number;
  scoredBy: User;
  pokemon: string;
  date: string;
}
