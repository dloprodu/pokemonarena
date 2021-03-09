export interface GetRankingResponse {
  _id: string;
  score: number;
  scoredBy: { _id: string; alias: string };
  pokemon: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}