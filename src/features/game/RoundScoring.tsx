import { useEffect, useState } from 'react';
import { Player } from './types';

interface RoundScoringProps {
  players: Player[];
  onScoreSubmit: (scores: Record<string, number>) => void;
  initialScores?: Record<string, number>;
  onCancel?: () => void;
  isEditing?: boolean;
  roundNumber?: number;
}

export function RoundScoring({
  players,
  onScoreSubmit,
  initialScores,
  onCancel,
  isEditing = false,
  roundNumber,
}: RoundScoringProps) {
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (initialScores) {
      setScores(initialScores);
    }
  }, [initialScores]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScoreSubmit(scores);
    if (!isEditing) {
      setScores({});
    }
  };

  const handleScoreChange = (playerId: string, value: string) => {
    const numberValue = value === '' ? 0 : parseInt(value, 10);
    setScores(prev => ({
      ...prev,
      [playerId]: numberValue,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold dark:text-white">
        {isEditing ? `Edit Round ${roundNumber} Scores` : 'New Round'}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {players.map(player => (
          <div key={player.id} className="space-y-2">
            <label htmlFor={`score-${player.id}`} className="mb-2 block text-lg font-medium dark:text-gray-300">
              {player.name}
            </label>
            <input
              type="number"
              id={`score-${player.id}`}
              value={scores[player.id] || ''}
              onChange={e => handleScoreChange(player.id, e.target.value)}
              className="block h-16 w-full rounded-md border-gray-300 px-6 py-4 text-2xl shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="0"
              step="5"
              required
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isEditing ? 'Save Changes' : 'Submit Scores'}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
