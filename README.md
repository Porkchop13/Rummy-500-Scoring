# Rummy 500 Scorekeeper

A simple, user-friendly application to track scores for Rummy 500 card games.

## Features

- Create games with multiple players
- Record scores for each round
- View cumulative scores and rankings
- Track game history
- Persist game data using local storage
- Peer-to-peer multiplayer support using WebRTC and a signaling server

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

4. Set up and run the signaling server:

   ```
   node src/features/multiplayer/SignalingServer.ts
   ```

## Usage

1. Add player names to start a new game
2. Enter scores for each round
3. View the scoreboard to track progress
4. End the game when finished
5. Review game history
6. Initiate a multiplayer game and connect to the signaling server

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Shared UI components
├── features/         # Feature modules
│   ├── game/         # Game management
│   ├── players/      # Player management
│   ├── scoring/      # Score tracking
│   ├── multiplayer/  # Multiplayer support
└── utils/            # Utility functions
```

## License

MIT
