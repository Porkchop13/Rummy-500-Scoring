import { ChartBarIcon, PlusCircleIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { usePlayerProfiles } from '../players/use-player-profiles';
import { NewGame } from './NewGame';
import { RoundScoring } from './RoundScoring';
import { Game as GameType, Player, Round } from './types';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WINNING_SCORE = 500;

export function Game() {
  const [game, setGame] = useState<GameType | null>(null);
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [winner, setWinner] = useState<{ name: string; score: number } | null>(null);
  const { updateProfileStats } = usePlayerProfiles();

  const handleGameStart = (players: Player[]) => {
    const newGame: GameType = {
      id: crypto.randomUUID(),
      players,
      rounds: [],
      dateStarted: new Date().toISOString(),
    };
    setGame(newGame);
  };

  const handleRoundSubmit = (scores: Record<string, number>) => {
    if (!game) return;

    const newRound: Round = {
      id: crypto.randomUUID(),
      scores,
    };

    const newGame = {
      ...game,
      rounds: [...game.rounds, newRound],
    };

    // Check if game is over and update profiles
    const totalScores = getTotalScores(newGame);
    const playersOver500 = Object.entries(totalScores).filter(([_, score]) => score >= WINNING_SCORE);

    if (playersOver500.length > 0) {
      // Find the player with the highest score
      const winningEntry = playersOver500.reduce((highest, current) => (current[1] > highest[1] ? current : highest));
      const winningPlayer = game.players.find(p => p.id === winningEntry[0]);
      if (winningPlayer) {
        setWinner({
          name: winningPlayer.name,
          score: winningEntry[1],
        });
      }

      game.players.forEach(player => {
        if (player.profileId) {
          const finalScore = totalScores[player.id];
          const isWinner = player.id === winningEntry[0];
          updateProfileStats(player.profileId, finalScore, isWinner);
        }
      });
    }

    setGame(newGame);
  };

  const handleRoundUpdate = (roundId: string, newScores: Record<string, number>) => {
    if (!game) return;
    setGame({
      ...game,
      rounds: game.rounds.map(round => (round.id === roundId ? { ...round, scores: newScores } : round)),
    });
    setEditingRoundId(null);
  };

  const getTotalScores = (gameState = game) => {
    if (!gameState) return {};

    return gameState.players.reduce(
      (totals, player) => {
        totals[player.id] = gameState.rounds.reduce((sum, round) => sum + (round.scores[player.id] || 0), 0);
        return totals;
      },
      {} as Record<string, number>
    );
  };

  const getScoreProgression = () => {
    if (!game || !game.rounds.length) return null;

    const labels = game.rounds.map((_, index) => `Round ${index + 1}`);
    const datasets = game.players.map(player => {
      let runningTotal = 0;
      const data = game.rounds.map(round => {
        runningTotal += round.scores[player.id] || 0;
        return runningTotal;
      });

      return {
        label: player.name,
        data,
        borderColor: player.color || `hsl(${Math.random() * 360}, 70%, 50%)`,
        tension: 0.1,
      };
    });

    return { labels, datasets };
  };

  const handleNewGameClick = () => {
    setShowNewGameConfirm(true);
  };

  const handleNewGameConfirm = () => {
    setGame(null);
    setShowNewGameConfirm(false);
    setEditingRoundId(null);
  };

  if (!game) {
    return <NewGame onGameStart={handleGameStart} />;
  }

  const totalScores = getTotalScores();
  const chartData = getScoreProgression();

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-bold dark:text-white">Current Game</h2>
        <button
          onClick={handleNewGameClick}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PlusCircleIcon className="h-5 w-5" />
          New Game
        </button>
      </div>

      {showNewGameConfirm && (
        <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">Start New Game?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Starting a new game will end the current game. Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowNewGameConfirm(false)}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleNewGameConfirm}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Start New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="animate-bounce-slow mx-4 w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex justify-center">
              <TrophyIcon className="h-16 w-16 text-yellow-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold dark:text-white">🎉 We Have a Winner! 🎉</h3>
            <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
              Congratulations to {winner.name} with {winner.score} points!
            </p>
            <button
              onClick={() => setWinner(null)}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {game.players.map(player => {
          const score = totalScores[player.id];
          const progressPercent = Math.min((score / WINNING_SCORE) * 100, 100);

          return (
            <div key={player.id} className="rounded bg-gray-50 p-4 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <UserCircleIcon 
                  className="h-5 w-5" 
                  style={{ color: player.color || '#9ca3af' }}
                />
                <h3 className="font-semibold dark:text-white">{player.name}</h3>
              </div>
              <p className="mb-2 text-2xl dark:text-white">{score}</p>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="absolute h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: player.color || '#2563eb'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {chartData && game.rounds.length > 0 && (
        <div className="rounded-lg bg-white dark:bg-gray-800">
          <button
            onClick={() => setShowChart(!showChart)}
            className="flex w-full items-center justify-between rounded-lg p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-xl font-semibold dark:text-white">Score Progression</h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{showChart ? 'Hide Chart' : 'Show Chart'}</span>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${
              showChart ? 'h-[400px] p-4 opacity-100' : 'h-0 p-0 opacity-0'
            }`}
          >
            {showChart && (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(156, 163, 175, 0.1)',
                      },
                      ticks: {
                        color: 'rgb(156, 163, 175)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(156, 163, 175, 0.1)',
                      },
                      ticks: {
                        color: 'rgb(156, 163, 175)',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: 'rgb(156, 163, 175)',
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="border-t pt-6 dark:border-gray-700">
        {editingRoundId ? (
          <RoundScoring
            players={game.players}
            onScoreSubmit={scores => handleRoundUpdate(editingRoundId, scores)}
            initialScores={game.rounds.find(r => r.id === editingRoundId)?.scores}
            onCancel={() => setEditingRoundId(null)}
            isEditing={true}
            roundNumber={game.rounds.findIndex(r => r.id === editingRoundId) + 1}
          />
        ) : (
          <RoundScoring players={game.players} onScoreSubmit={handleRoundSubmit} />
        )}
      </div>

      {game.rounds.length > 0 && (
        <div className="border-t pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">Round History</h3>
          <div className="space-y-2">
            {game.rounds.map((round, index) => (
              <div key={round.id} className="rounded bg-gray-50 p-4 shadow-sm dark:bg-gray-800">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium dark:text-white">Round {index + 1}</h4>
                  {editingRoundId !== round.id && (
                    <button
                      onClick={() => setEditingRoundId(round.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {game.players.map(player => (
                    <div key={player.id} className="flex items-center gap-2 dark:text-gray-300">
                      <span 
                        className="inline-block h-2 w-2 rounded-full" 
                        style={{ backgroundColor: player.color || '#9ca3af' }}
                      />
                      {player.name}: {round.scores[player.id] || 0}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
