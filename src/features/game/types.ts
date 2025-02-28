export interface Player {
  id: string;
  name: string;
  profileId?: string; // Optional reference to a player profile
  color?: string; // Player's color from their profile
}

export interface Round {
  id: string;
  scores: Record<string, number>; // playerId -> score
}

export interface Game {
  id: string;
  players: Player[];
  rounds: Round[];
  dateStarted: string;
  dateEnded?: string;
}

export type GameStatus = 'active' | 'completed';
