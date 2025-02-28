import { PlusIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { usePlayerProfiles } from './use-player-profiles';

export function PlayerProfiles() {
  const { profiles, addProfile, deleteProfile, updateProfile } = usePlayerProfiles();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerColor, setNewPlayerColor] = useState('#6366f1'); // Default indigo color
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    addProfile(newPlayerName.trim(), newPlayerColor);
    setNewPlayerName('');
    inputRef.current?.focus();
  };

  const handleColorChange = (profileId: string, color: string) => {
    const profile = profiles[profileId];
    if (profile) {
      updateProfile(profileId, { ...profile, color });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Player Profiles</h2>
      </div>

      <form onSubmit={handleAddProfile} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newPlayerName}
          onChange={e => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
        />
        <input
          type="color"
          value={newPlayerColor}
          onChange={e => setNewPlayerColor(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border-0"
          title="Choose player color"
        />
        <button
          type="submit"
          disabled={!newPlayerName.trim()}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add Profile
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(profiles).map(profile => (
          <div
            key={profile.id}
            className="flex items-start justify-between rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            <div className="flex items-start space-x-3">
              <UserCircleIcon className="h-6 w-6" style={{ color: profile.color || '#9ca3af' }} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{profile.name}</h3>
                  <input
                    type="color"
                    value={profile.color || '#9ca3af'}
                    onChange={e => handleColorChange(profile.id, e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-0"
                    title="Change player color"
                  />
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <p>Games played: {profile.stats.gamesPlayed}</p>
                  <p>Games won: {profile.stats.gamesWon}</p>
                  <p>Average score: {profile.stats.averageScore}</p>
                  <p>Highest score: {profile.stats.highestScore}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteProfile(profile.id)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
