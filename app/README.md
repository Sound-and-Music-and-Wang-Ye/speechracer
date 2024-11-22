# SpeechRacer Frontend

A real-time multiplayer typing game powered by speech recognition. Challenge yourself and others to speak text accurately and quickly!

## Features

- 🎮 Real-time multiplayer racing
- 🎯 Multiple difficulty levels
- 🎤 Speech recognition
- 📊 Live progress tracking
- 🏆 Performance statistics
- ⚙️ Customizable settings

## Tech Stack

- React 18
- Chakra UI
- WebSocket
- Web Speech API
- Vite

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the app directory: 

```bash
cd app
```
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```
## Project Structure

```
app/
├── src/
│ ├── assets/ # Static assets
│ ├── components/ # Reusable React components
│ ├── utils/ # Utility functions
│ ├── views/ # Page components
│ ├── App.jsx # Root component
│ ├── main.jsx # Entry point
│ └── router.jsx # Route definitions
├── public/ # Public assets
└── index.html # HTML template
```

## Key Components

### Views
- `StartPage`: Landing page with difficulty selection
- `InstanceView`: Main game interface with real-time speech recognition
- `ResultsView`: Post-game statistics and performance metrics

### Components
- `QuoteDisplay`: Displays text to be spoken with progress highlighting
- `PlayerDisplay`: Shows current players in the game
- `ProgressStats`: Real-time progress tracking for all players
- `SettingsModal`: User preferences configuration

## Building for Production

```bash
npm run build
```

This will create a `dist` directory with optimized production build.
