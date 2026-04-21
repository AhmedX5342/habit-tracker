# Discipline Tracker

A modern, hybrid web and mobile application for tracking daily habits, visualizing progress, and maintaining streaks. Built with React, TypeScript, Vite, and Capacitor.

## Features

- **Dynamic Habit Management**: Add and delete habits on the fly with an intuitive modal interface
- **Daily Tracker**: Record pass/fail entries for each habit with instant feedback
- **Calendar View**: Visual calendar for each habit showing daily results at a glance
- **Streak Tracking**: Track current and best streaks for each habit with 🔥 indicators
- **Multiple Chart Visualizations**: 
  - Success rate per week/month
  - Weekly/monthly breakdown of passes and fails
  - Cumulative success rate over time
  - 30-day rolling average
- **Period Toggles**: Switch between weekly and monthly views for all charts
- **Chart Visibility Controls**: Show/hide specific charts with a dropdown menu
- **Statistics Dashboard**: Real-time success rate cards with pass/fail counts
- **Diary System**: Journal entries linked to daily tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Type Safety**: Full TypeScript throughout the application

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Chart.js** for data visualization
- **Custom CSS** with dark theme

### Mobile & Data Persistence
- **Capacitor** for cross-platform mobile and web support
- **Capacitor Filesystem** for file-based data storage
- **Capacitor Preferences** for shared preferences on Android
- **Local browser storage** for web persistence
- ~~Express.js~~ (legacy backend removed - now fully client-side)

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety

## How It Works

The app uses **local data persistence** instead of a server:
- **On Web**: Data is stored using the Capacitor Filesystem API (behaves like local storage)
- **On Android**: Data is stored in the app's Documents directory and shared preferences
- **No backend required**: The app is entirely client-side, making it fast and offline-capable

Data is stored in two JSON files:
- `data.json` - Habits and daily tracking entries
- `diary.json` - Diary entries

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- For Android: Android SDK and Android Studio (optional but recommended)

## Running on Web

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AhmedX5342/habit-tracker.git
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Web

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Running on Android

### Setup

1. Add the Android platform to Capacitor:
```bash
npx cap add android
```

2. Build the web app first:
```bash
npm run build
```

3. Copy the web build to Capacitor:
```bash
npx cap copy
```

4. Open the Android project in Android Studio:
```bash
npx cap open android
```

### Running on Android Device/Emulator

- Using Android Studio: Click the "Run" button (green play icon)
- Or from command line:
```bash
npx cap run android
```

### Building for Android Release

```bash
npx cap copy
cd android
./gradlew assembleRelease
```

The APK will be available in `android/app/build/outputs/apk/release/`

## Project Structure

```
habit-tracker/
├── src/                       # React TypeScript source code
│   ├── components/            # React components
│   │   ├── Tracker.tsx       # Daily habit tracking
│   │   ├── Calendar.tsx      # Calendar view
│   │   ├── Statistics.tsx    # Charts and analytics
│   │   ├── Diary.tsx         # Diary management
│   │   ├── Settings.tsx      # App settings
│   │   └── Header.tsx        # Navigation header
│   ├── types/                # TypeScript interfaces
│   │   └── index.ts          # Type definitions
│   ├── utils/                # Utility functions
│   │   ├── api.ts            # Capacitor data persistence
│   │   └── helpers.ts        # Helper functions
│   ├── App.tsx               # Main app component
│   ├── App.css               # Global styles
│   └── main.tsx              # Entry point
├── android/                   # Android native code (auto-generated)
├── dist/                      # Build output
├── capacitor.config.ts       # Capacitor configuration
├── vite.config.ts            # Vite configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## Data Format

### data.json
```json
{
  "habits": ["exercise", "meditate", "read"],
  "entries": {
    "2026-04-20": {
      "exercise": 1,
      "meditate": 0,
      "read": 1
    }
  }
}
```

### diary.json
```json
{
  "2026-04-20": {
    "title": "Great Day!",
    "body": "Completed all my habits today..."
  }
}
```

## Usage Guide

### Adding a Habit
1. Go to the **Tracker** tab
2. Click **+ Add Habit** button
3. Enter a habit name
4. Press Enter or click **Add Habit**

### Tracking Daily Progress
1. Select a date using the date picker (defaults to today)
2. For each habit, click **✓ Pass** or **✗ Fail**
3. Click **Save Entry** to save your progress

### Using the Calendar View
- Each habit displays a calendar showing:
  - ✓ Green checkmark for passed days
  - ✗ Red X for failed days
  - Highlighted border for today

### Viewing Statistics
1. Go to the **Statistics** tab
2. View success rate cards for each habit
3. Use **Chart Visibility** dropdown to toggle specific charts
4. Use **Period Toggle** to switch between weekly/monthly views

### Managing Diary Entries
1. Go to the **Diary** tab
2. Click **+ New** to create an entry for today
3. Add a title and your thoughts
4. Click **Save** to store your entry
5. Use **Delete** to remove entries

## Color System

Each habit is assigned a unique color from the palette:
- 🟠 Orange (#c4763a)
- 🔵 Blue (#3a7cc4)
- 🟢 Green (#5aa36f)
- 🟣 Purple (#a574bc)
- 🔴 Red/Pink (#d97a6f)

Colors cycle if more than 5 habits are created.

## Available Scripts

```bash
# Development (web)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean build artifacts
npm run clean
```

## Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Android Support

- ✅ Android 6.0+ (API level 23+)
- ✅ Built with Capacitor for native performance

## Migration from Legacy Backend

This version removes the Express.js backend in favor of a fully client-side architecture:

**What Changed:**
- ❌ Express server removed (no `server.js` or backend process needed)
- ✅ Data persists locally using Capacitor Filesystem and Preferences
- ✅ Faster startup (no server to run)
- ✅ Works offline
- ✅ Can be packaged as a native Android app

**No API Changes:** The app uses the same data format, just stored locally instead of on a server.

## Troubleshooting

### Port already in use (web dev)
```bash
npm run dev -- --port 3000
```

### Clear build cache
```bash
npm run clean
npm install
npm run build
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
npx cap copy
```

### Data not persisting on Android
- Ensure the app has permission to access storage in Android Settings
- Check `capacitor.config.ts` for correct webDir configuration

## Future Enhancements

- [ ] User authentication and cloud sync
- [ ] Data export (CSV/JSON)
- [ ] Habit reminders and notifications
- [ ] Dark/light theme toggle
- [ ] Habit categories and tags
- [ ] Social sharing features
- [ ] Backup and restore functionality

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Cross-platform support with [Capacitor](https://capacitorjs.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Inspired by atomic habits and consistency tracking

---

**Built with discipline for building better habits** 🎯
