import { BookOpenIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/theme-context';
import { Game } from './features/game/Game';
import { PlayerProfiles } from './features/players/PlayerProfiles';
import { Rules } from './features/rules/Rules';

function App() {
  const [showRules, setShowRules] = useState(false);
  const [view, setView] = useState<'game' | 'profiles'>('game');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rummy 500 Scorekeeper</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView(view === 'game' ? 'profiles' : 'game')}
                className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <UserCircleIcon className="mr-2 h-5 w-5" />
                {view === 'game' ? 'Profiles' : 'Game'}
              </button>
              <button
                onClick={() => setShowRules(true)}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <BookOpenIcon className="mr-2 h-5 w-5" />
                Rules
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl py-6">{view === 'game' ? <Game /> : <PlayerProfiles />}</main>

        {showRules && <Rules isOpen={showRules} onClose={() => setShowRules(false)} />}
      </div>
    </ThemeProvider>
  );
}

export default App;
