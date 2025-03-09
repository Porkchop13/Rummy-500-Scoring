import { useEffect, useRef, useState } from 'react';
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
  const firstInputRef = useRef<HTMLInputElement>(null);

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
      // Focus the first input after clearing scores
      firstInputRef.current?.focus();
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {players.map((player, index) => (
          <div key={player.id} className="space-y-2">
            <label
              htmlFor={`score-${player.id}`}
              className="mb-1 flex items-center gap-2 text-base font-medium sm:text-lg dark:text-gray-300"
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: player.color || '#9ca3af' }}
              />
              <span className="truncate">{player.name}</span>
            </label>
            <input
              ref={index === 0 ? firstInputRef : undefined}
              type="number"
              id={`score-${player.id}`}
              value={scores[player.id] || ''}
              onChange={e => handleScoreChange(player.id, e.target.value)}
              className="block h-14 w-full rounded-md border-gray-300 px-4 py-2 text-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:h-16 sm:text-2xl dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="0"
              step="5"
              inputMode="numeric"
              required
              style={{
                borderColor: player.color || 'var(--tw-border-opacity)',
                borderWidth: '2px',
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
        >
          {isEditing ? 'Save Changes' : 'Submit Scores'}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 sm:w-auto"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
