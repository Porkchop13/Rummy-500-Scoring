import { useCallback, useEffect, useState } from 'react';
import { PlayerProfile, PlayerProfiles, PlayerStats } from './types';

const STORAGE_KEY = 'rummy500_player_profiles';

const createInitialStats = (): PlayerStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  totalScore: 0,
  averageScore: 0,
  highestScore: 0,
  roundsPlayed: 0,
  totalRoundScore: 0,
  averageRoundScore: 0,
  marginOfVictory: 0,
  gamesWithMargin: 0,
});

// Load initial profiles from localStorage
const loadStoredProfiles = (): PlayerProfiles => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return {};

  // Handle migration of old profiles that don't have the new stats fields
  let profiles: PlayerProfiles = JSON.parse(stored);

  // Check if we need to migrate profile data
  let needsMigration = false;

  Object.values(profiles).forEach(profile => {
    if (profile.stats.roundsPlayed === undefined) {
      needsMigration = true;
    }
  });

  if (needsMigration) {
    Object.keys(profiles).forEach(id => {
      const profile = profiles[id];
      profiles[id] = {
        ...profile,
        stats: {
          ...profile.stats,
          roundsPlayed: 0,
          totalRoundScore: 0,
          averageRoundScore: 0,
          marginOfVictory: 0,
          gamesWithMargin: 0,
        },
      };
    });
  }

  return profiles;
};

export function usePlayerProfiles() {
  // Initialize with stored value instead of empty object
  const [profiles, setProfiles] = useState<PlayerProfiles>(loadStoredProfiles);

  // Save to localStorage whenever profiles change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const addProfile = useCallback((name: string, color?: string) => {
    const newProfile: PlayerProfile = {
      id: crypto.randomUUID(),
      name,
      color,
      stats: createInitialStats(),
      createdAt: new Date().toISOString(),
    };

    setProfiles(current => ({
      ...current,
      [newProfile.id]: newProfile,
    }));

    return newProfile;
  }, []);

  const updateProfile = useCallback((profileId: string, updatedProfile: PlayerProfile) => {
    setProfiles(current => ({
      ...current,
      [profileId]: updatedProfile,
    }));
  }, []);

  const updateProfileStats = useCallback(
    (
      profileId: string,
      gameScore: number,
      isWinner: boolean,
      roundsCount: number = 0,
      totalRoundScore: number = 0,
      marginOfVictory: number = 0
    ) => {
      setProfiles(current => {
        const profile = current[profileId];
        if (!profile) return current;

        const newStats = {
          gamesPlayed: profile.stats.gamesPlayed + 1,
          gamesWon: profile.stats.gamesWon + (isWinner ? 1 : 0),
          totalScore: profile.stats.totalScore + gameScore,
          highestScore: Math.max(profile.stats.highestScore, gameScore),
          averageScore: Math.round((profile.stats.totalScore + gameScore) / (profile.stats.gamesPlayed + 1)),
          roundsPlayed: profile.stats.roundsPlayed + roundsCount,
          totalRoundScore: profile.stats.totalRoundScore + totalRoundScore,
          averageRoundScore:
            roundsCount > 0
              ? Math.round(
                  (profile.stats.totalRoundScore + totalRoundScore) / (profile.stats.roundsPlayed + roundsCount)
                )
              : profile.stats.averageRoundScore,
          marginOfVictory: profile.stats.marginOfVictory + (isWinner ? marginOfVictory : 0),
          gamesWithMargin: profile.stats.gamesWithMargin + (isWinner && marginOfVictory > 0 ? 1 : 0),
        };

        return {
          ...current,
          [profileId]: {
            ...profile,
            stats: newStats,
            lastPlayed: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const updateRoundStats = useCallback((profileId: string, roundScore: number) => {
    setProfiles(current => {
      const profile = current[profileId];
      if (!profile) return current;

      const newTotalRoundScore = profile.stats.totalRoundScore + roundScore;
      const newRoundsPlayed = profile.stats.roundsPlayed + 1;

      return {
        ...current,
        [profileId]: {
          ...profile,
          stats: {
            ...profile.stats,
            roundsPlayed: newRoundsPlayed,
            totalRoundScore: newTotalRoundScore,
            averageRoundScore: Math.round(newTotalRoundScore / newRoundsPlayed),
          },
        },
      };
    });
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(current => {
      const { [profileId]: removed, ...rest } = current;
      return rest;
    });
  }, []);

  const clearAllStats = useCallback(() => {
    setProfiles(current => {
      const updatedProfiles = { ...current };
      Object.keys(updatedProfiles).forEach(profileId => {
        updatedProfiles[profileId] = {
          ...updatedProfiles[profileId],
          stats: createInitialStats(),
        };
      });
      return updatedProfiles;
    });
  }, []);

  return {
    profiles,
    addProfile,
    updateProfile,
    updateProfileStats,
    updateRoundStats,
    deleteProfile,
    clearAllStats,
  };
}
