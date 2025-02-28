import { useCallback, useEffect, useState } from 'react';
import { PlayerProfile, PlayerProfiles, PlayerStats } from './types';

const STORAGE_KEY = 'rummy500_player_profiles';

const createInitialStats = (): PlayerStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  totalScore: 0,
  averageScore: 0,
  highestScore: 0,
});

// Load initial profiles from localStorage
const loadStoredProfiles = (): PlayerProfiles => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
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

  const updateProfileStats = useCallback((profileId: string, gameScore: number, isWinner: boolean) => {
    setProfiles(current => {
      const profile = current[profileId];
      if (!profile) return current;

      const newStats = {
        gamesPlayed: profile.stats.gamesPlayed + 1,
        gamesWon: profile.stats.gamesWon + (isWinner ? 1 : 0),
        totalScore: profile.stats.totalScore + gameScore,
        highestScore: Math.max(profile.stats.highestScore, gameScore),
        averageScore: Math.round((profile.stats.totalScore + gameScore) / (profile.stats.gamesPlayed + 1)),
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
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(current => {
      const { [profileId]: removed, ...rest } = current;
      return rest;
    });
  }, []);

  return {
    profiles,
    addProfile,
    updateProfile,
    updateProfileStats,
    deleteProfile,
  };
}
