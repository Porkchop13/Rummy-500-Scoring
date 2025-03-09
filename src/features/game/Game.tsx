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
import { useMultiplayer } from '../multiplayer/MultiplayerContext';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WINNING_SCORE = 500;

export function Game() {
  const [game, setGame] = useState<GameType | null>(null);
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [winner, setWinner] = useState<{ name: string; score: number } | null>(null);
  const { updateProfileStats, updateRoundStats } = usePlayerProfiles();
  const { sendGameState, gameState } = useMultiplayer();

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

    // Track round scores for each player profile
    game.players.forEach(player => {
      if (player.profileId) {
        // Update player profile with round score
        updateRoundStats(player.profileId, scores[player.id] || 0);
      }
    });

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
    const playersOver500 = Object.entries(totalScores)
      .filter(([_, score]) => score >= WINNING_SCORE)
      .sort(([, a], [, b]) => b - a); // Sort by score descending

    // Only end the game if there's one clear winner
    if (playersOver500.length === 1 || (playersOver500.length > 1 && playersOver500[0][1] > playersOver500[1][1])) {
      const winningEntry = playersOver500[0];
      const winningPlayer = game.players.find(p => p.id === winningEntry[0]);
      const winningScore = winningEntry[1];

      // Calculate margin of victory
      const secondHighestScore =
        playersOver500.length > 1
          ? playersOver500[1][1]
          : Math.max(
              ...Object.entries(totalScores)
                .filter(([id]) => id !== winningEntry[0])
                .map(([, score]) => score)
            );

      const marginOfVictory = winningScore - secondHighestScore;

      if (winningPlayer) {
        setWinner({
          name: winningPlayer.name,
          score: winningScore,
        });
      }

      // Update final game stats for all players
      game.players.forEach(player => {
        if (player.profileId) {
          const finalScore = totalScores[player.id];
          const isWinner = player.id === winningEntry[0];

          // Get total round count and total round scores
          const roundsCount = game.rounds.length + 1; // Include current round
          const totalRoundScore = game.rounds.reduce(
            (sum, round) => sum + (round.scores[player.id] || 0),
            scores[player.id] || 0 // Add current round score
          );

          // Update player profile with final game stats
          updateProfileStats(
            player.profileId,
            finalScore,
            isWinner,
            roundsCount,
            totalRoundScore,
            isWinner ? marginOfVictory : 0
          );
        }
      });

      // Mark game as ended
      newGame.dateEnded = new Date().toISOString();
    }

    setGame(newGame);
    sendGameState(newGame);
  };

  const handleRoundUpdate = (roundId: string, newScores: Record<string, number>) => {
    if (!game) return;

    // Get the original round scores
    const originalRound = game.rounds.find(round => round.id === roundId);

    if (originalRound) {
      // Update player round stats
      game.players.forEach(player => {
        if (player.profileId) {
          // Subtract old score and add new score
          const oldScore = originalRound.scores[player.id] || 0;
          const newScore = newScores[player.id] || 0;

          if (oldScore !== newScore) {
            // Remove old score
            updateRoundStats(player.profileId, -oldScore);
            // Add new score
            updateRoundStats(player.profileId, newScore);
          }
        }
      });
    }

    const updatedGame = {
      ...game,
      rounds: game.rounds.map(round => (round.id === roundId ? { ...round, scores: newScores } : round)),
    };

    setGame(updatedGame);
    setEditingRoundId(null);
    sendGameState(updatedGame);
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

    const labels = game.rounds.map((_, index) => `R${index + 1}`);
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold dark:text-white">Current Game</h2>
        <button
          onClick={handleNewGameClick}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
          <PlusCircleIcon className="h-5 w-5" />
          New Game
        </button>
      </div>

      {showNewGameConfirm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="animate-bounce-slow w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
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

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {game.players.map(player => {
          const score = totalScores[player.id];
          const progressPercent = Math.min((score / WINNING_SCORE) * 100, 100);

          return (
            <div key={player.id} className="rounded bg-gray-50 p-3 shadow-sm sm:p-4 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-5 w-5" style={{ color: player.color || '#9ca3af' }} />
                <h3 className="truncate text-sm font-semibold sm:text-base dark:text-white">{player.name}</h3>
              </div>
              <p className="mb-2 text-xl font-semibold sm:text-2xl dark:text-white">{score}</p>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="absolute h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: player.color || '#2563eb',
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
              showChart ? 'h-[300px] overflow-hidden p-4 opacity-100 sm:h-[400px]' : 'h-0 p-0 opacity-0'
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
                        font: {
                          size: 10,
                        },
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 10,
                        color: 'rgb(156, 163, 175)',
                        font: {
                          size: 11,
                        },
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
              <div key={round.id} className="rounded bg-gray-50 p-3 shadow-sm sm:p-4 dark:bg-gray-800">
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
                      <span className="truncate">
                        {player.name}: {round.scores[player.id] || 0}
                      </span>
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
