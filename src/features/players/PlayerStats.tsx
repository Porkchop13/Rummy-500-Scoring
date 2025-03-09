import { ChartBarIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { usePlayerProfiles } from './use-player-profiles';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PlayerStats() {
  const { profiles } = usePlayerProfiles();
  const playersList = Object.values(profiles);

  // Calculate enhanced statistics
  const enhancedStats = playersList.map(player => {
    const { stats } = player;
    return {
      ...player,
      winRate: stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1) : '0.0',
      efficiency: stats.gamesPlayed > 0 ? ((stats.averageScore / 500) * 100).toFixed(1) : '0.0', // Score efficiency relative to target (500)
      avgMarginOfVictory: stats.gamesWithMargin > 0 ? Math.round(stats.marginOfVictory / stats.gamesWithMargin) : 0,
    };
  });

  // Sort players by games won for ranking
  const rankedPlayers = [...enhancedStats].sort((a, b) => {
    // First sort by win rate
    const winRateDiff = Number(b.winRate) - Number(a.winRate);
    if (winRateDiff !== 0) return winRateDiff;

    // If win rate is the same, sort by average score
    return b.stats.averageScore - a.stats.averageScore;
  });

  // Prepare chart data
  const chartData = {
    labels: playersList.map(player => player.name),
    datasets: [
      {
        label: 'Games Won',
        data: playersList.map(player => player.stats.gamesWon),
        backgroundColor: playersList.map(player => player.color || '#6366f1'),
      },
      {
        label: 'Average Score',
        data: playersList.map(player => player.stats.averageScore),
        backgroundColor: playersList.map(player => `${player.color}99` || '#9ca3af99'),
      },
    ],
  };

  // Prepare win rate chart data
  const winRateChartData = {
    labels: playersList.map(player => player.name),
    datasets: [
      {
        label: 'Win Rate (%)',
        data: enhancedStats.map(player => Number(player.winRate)),
        backgroundColor: playersList.map(player => player.color || '#6366f1'),
      },
    ],
  };

  // Prepare round score chart data
  const roundScoreChartData = {
    labels: playersList.map(player => player.name),
    datasets: [
      {
        label: 'Avg Round Score',
        data: playersList.map(player => player.stats.averageRoundScore),
        backgroundColor: playersList.map(player => player.color || '#6366f1'),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        position: 'bottom' as const, // Type assertion to fix the error
        labels: {
          boxWidth: 12,
          padding: 8,
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
          },
        },
      },
    },
  } as const; // Make the entire object constant to preserve literal types

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Player Statistics</h2>

      {playersList.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow sm:p-8 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">No player profiles created yet.</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create player profiles to see statistics here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rankedPlayers.map((player, index) => (
              <div key={player.id} className="rounded-lg bg-white p-4 shadow sm:p-6 dark:bg-gray-800">
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div className="flex min-w-0 items-center space-x-2 overflow-hidden">
                    {index === 0 && <TrophyIcon className="h-5 w-5 flex-shrink-0 text-yellow-400" />}
                    <UserCircleIcon
                      className="h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6"
                      style={{ color: player.color || '#9ca3af' }}
                    />
                    <h3 className="truncate font-medium text-gray-900 dark:text-white">{player.name}</h3>
                  </div>
                  <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Rank #{index + 1}
                  </div>
                </div>

                <div className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Record:</span>
                    <span className="font-medium dark:text-white">
                      {player.stats.gamesWon} - {player.stats.gamesPlayed - player.stats.gamesWon}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Win Rate:</span>
                    <span className="font-medium dark:text-white">{player.winRate}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Avg Game Score:</span>
                    <span className="font-medium dark:text-white">{player.stats.averageScore}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Highest Score:</span>
                    <span className="font-medium dark:text-white">{player.stats.highestScore}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Avg Round Score:</span>
                    <span className="font-medium dark:text-white">
                      {player.stats.averageRoundScore > 0
                        ? player.stats.averageRoundScore
                        : player.stats.roundsPlayed > 0
                          ? Math.round(player.stats.totalRoundScore / player.stats.roundsPlayed)
                          : 0}
                      {player.stats.roundsPlayed === 0 && ' (No data)'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Avg Victory Margin:</span>
                    <span className="font-medium dark:text-white">
                      {player.avgMarginOfVictory}
                      {player.stats.gamesWithMargin === 0 && ' (No data)'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Score Efficiency:</span>
                    <span className="font-medium dark:text-white">{player.efficiency}%</span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="absolute h-full rounded-full"
                      style={{
                        width: `${player.winRate}%`,
                        backgroundColor: player.color || '#2563eb',
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span>Win Rate</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {playersList.length >= 2 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-4 shadow sm:p-6 dark:bg-gray-800">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold sm:mb-4 sm:text-xl dark:text-white">
                  <ChartBarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Performance Comparison
                </h3>
                <div className="h-64 sm:h-80">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow sm:p-6 dark:bg-gray-800">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold sm:mb-4 sm:text-xl dark:text-white">
                  <ChartBarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Win Rate Comparison
                </h3>
                <div className="h-64 sm:h-80">
                  <Bar
                    data={winRateChartData}
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          ...chartOptions.scales.y,
                          max: 100,
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow sm:p-6 dark:bg-gray-800">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold sm:mb-4 sm:text-xl dark:text-white">
                  <ChartBarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  Average Round Score
                </h3>
                <div className="h-64 sm:h-80">
                  <Bar data={roundScoreChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
