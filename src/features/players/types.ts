export interface PlayerProfile {
  id: string;
  name: string;
  color?: string; // Hex color code
  stats: PlayerStats;
  createdAt: string;
  lastPlayed?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  roundsPlayed: number; // Total rounds played
  totalRoundScore: number; // Sum of all round scores
  averageRoundScore: number; // Average score per round
  marginOfVictory: number; // Total margin of victory (for winners)
  gamesWithMargin: number; // Number of games with recorded margin (for average calculation)
}

export type PlayerProfiles = Record<string, PlayerProfile>;
