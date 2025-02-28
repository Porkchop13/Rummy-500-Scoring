# Rummy 500 Scorekeeper

A simple, user-friendly application to track scores for Rummy 500 card games.

## Features

- Create games with multiple players
- Record scores for each round
- View cumulative scores and rankings
- Track game history
- Persist game data using local storage

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Router
- TailwindCSS v4 for styling
- Heroicons for iconography

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

## Usage

1. Add player names to start a new game
2. Enter scores for each round
3. View the scoreboard to track progress
4. End the game when finished
5. Review game history

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Shared UI components
├── features/         # Feature modules
│   ├── game/         # Game management
│   ├── players/      # Player management
│   └── scoring/      # Score tracking
└── utils/            # Utility functions
```

## License

MIT
