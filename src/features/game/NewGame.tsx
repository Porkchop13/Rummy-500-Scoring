import { PlusIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { usePlayerProfiles } from '../players/use-player-profiles';
import { Player } from './types';

interface NewGameProps {
  onGameStart: (players: Player[]) => void;
}

export function NewGame({ onGameStart }: NewGameProps) {
  const { profiles } = usePlayerProfiles();
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addPlayer = (name: string, profileId?: string) => {
    if (!name.trim()) return;

    const newPlayer: Player = {
      id: profileId || crypto.randomUUID(),
      name: name.trim(),
      profileId, // Store the profile ID if the player was selected from profiles
      color: profileId ? profiles[profileId]?.color : undefined,
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    inputRef.current?.focus();
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length >= 2) {
      onGameStart(players);
    }
  };

  const availableProfiles = Object.values(profiles).filter(profile => !players.some(p => p.profileId === profile.id));

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">New Game</h2>

      {availableProfiles.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium dark:text-white">Select from profiles:</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {availableProfiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => addPlayer(profile.name, profile.id)}
                className="flex items-center space-x-2 rounded-md border border-gray-300 p-2 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <UserCircleIcon className="h-5 w-5" style={{ color: profile.color || '#9ca3af' }} />
                <span className="truncate dark:text-white">{profile.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 font-medium dark:text-white">Add new player:</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            addPlayer(newPlayerName);
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            ref={inputRef}
            type="text"
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newPlayerName.trim()}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Add
          </button>
        </form>
      </div>

      {players.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium dark:text-white">Current players:</h3>
          <ul className="space-y-2">
            {players.map(player => (
              <li
                key={player.id}
                className="flex items-center justify-between rounded-md bg-white p-2 shadow dark:bg-gray-800"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <UserCircleIcon className="h-5 w-5 flex-shrink-0" style={{ color: player.color || '#9ca3af' }} />
                  <span className="truncate dark:text-white">{player.name}</span>
                </div>
                <button
                  onClick={() => removePlayer(player.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={players.length < 2}
        className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Start Game
      </button>
    </div>
  );
}
