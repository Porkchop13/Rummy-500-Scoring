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
}

export type PlayerProfiles = Record<string, PlayerProfile>;
