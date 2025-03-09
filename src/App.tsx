import { BookOpenIcon, ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/theme-context';
import { Game } from './features/game/Game';
import { PlayerProfiles } from './features/players/PlayerProfiles';
import { PlayerStats } from './features/players/PlayerStats';
import { Rules } from './features/rules/Rules';
import { MultiplayerProvider, useMultiplayer } from './features/multiplayer/MultiplayerContext';

function App() {
  const [showRules, setShowRules] = useState(false);
  const [view, setView] = useState<'game' | 'profiles' | 'stats'>('game');
  const { connectToPeer } = useMultiplayer();

  const handleMultiplayerClick = () => {
    const peerId = prompt('Enter the peer ID to connect:');
    if (peerId) {
      connectToPeer(peerId);
    }
  };

  return (
    <ThemeProvider>
      <MultiplayerProvider>
        <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
          <header className="bg-white shadow dark:bg-gray-800">
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-6">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Rummy 500</h1>
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0 sm:space-x-4">
                <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  <button
                    onClick={() => setView('game')}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium sm:flex-initial ${
                      view === 'game'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Game
                  </button>
                  <button
                    onClick={() => setView('profiles')}
                    className={`inline-flex flex-1 items-center justify-center rounded-md px-4 py-2 text-sm font-medium sm:flex-initial ${
                      view === 'profiles'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <UserCircleIcon className="mr-2 h-5 w-5" />
                    Profiles
                  </button>
                  <button
                    onClick={() => setView('stats')}
                    className={`inline-flex flex-1 items-center justify-center rounded-md px-4 py-2 text-sm font-medium sm:flex-initial ${
                      view === 'stats'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ChartBarIcon className="mr-2 h-5 w-5" />
                    Stats
                  </button>
                </div>
                <div className="flex w-full justify-between sm:w-auto">
                  <button
                    onClick={() => setShowRules(true)}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:flex-initial"
                  >
                    <BookOpenIcon className="mr-2 h-5 w-5" />
                    Rules
                  </button>
                  <button
                    onClick={handleMultiplayerClick}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 sm:flex-initial"
                  >
                    Multiplayer
                  </button>
                  <ThemeToggle className="ml-2" />
                </div>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-6">
            {view === 'game' && <Game />}
            {view === 'profiles' && <PlayerProfiles />}
            {view === 'stats' && <PlayerStats />}
          </main>
          {showRules && <Rules isOpen={showRules} onClose={() => setShowRules(false)} />}
        </div>
      </MultiplayerProvider>
    </ThemeProvider>
  );
}

export default App;
