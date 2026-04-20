# Discipline Tracker

A modern, full-stack web application for tracking daily habits, visualizing progress, and maintaining streaks. Built with React, TypeScript, and Express.

## Features

- **Dynamic Habit Management**: Add and delete habits on the fly with a beautiful modal dialog
- **Daily Tracker**: Record pass/fail entries for each habit with an intuitive interface
- **Calendar View**: Visual calendar display for each habit showing daily results at a glance
- **Streak Tracking**: Track current and best streaks for each habit with 🔥 emoji indicators
- **Multiple Chart Visualizations**: 
  - Success rate per week/month
  - Weekly/monthly fails breakdown
  - Cumulative success rate over time
  - 30-day rolling average
- **Period Toggles**: Switch between weekly and monthly views for all charts
- **Chart Visibility Controls**: Show/hide specific charts with a dropdown menu
- **Statistics Dashboard**: Real-time success rate cards with pass/fail counts
- **Diary System**: Journal entries linked to daily tracking with a dedicated sidebar
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Full type safety throughout the application

## Technology Stack

### Frontend
- **React 19** with Hooks
- **TypeScript** for type safety
- **Vite** for fast builds and hot reload
- **Chart.js** for data visualization
- **Custom CSS** with dark theme (no Tailwind)

### Backend
- **Node.js** with Express.js
- **JSON file-based** persistence
- **Unified server** architecture

### Development Tools
- **ESLint** for code quality
- **Concurrently** for running multiple servers

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AhmedX5342/habit-tracker.git
cd habit-tracker
```

2. Install root dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd habit-tracker-frontend
npm install
cd ..
```

4. Start the unified server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3001
```

## Project Structure

```
habit-tracker/
├── habit-tracker-frontend/    # React TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Calendar.tsx   # Calendar view component
│   │   │   ├── Diary.tsx      # Diary management
│   │   │   ├── Header.tsx     # App header with tabs
│   │   │   ├── Statistics.tsx # Charts and stats
│   │   │   └── Tracker.tsx    # Daily habit tracking
│   │   ├── types/             # TypeScript interfaces
│   │   │   └── index.ts       # Type definitions
│   │   ├── utils/             # Utility functions
│   │   │   └── helpers.ts     # Helper functions
│   │   ├── App.tsx            # Main app component
│   │   ├── App.css            # Global styles
│   │   └── main.tsx           # Entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
├── data.json                  # Habit tracking data (auto-generated)
├── diary.json                 # Diary entries (auto-generated)
├── server.js                  # Express backend (legacy)
├── unified-server.js          # Unified development server
├── package.json               # Root dependencies
└── README.md                  # This file
```

## Available Scripts

To start the app, run either of these from the root directory — both are equivalent:

```bash
npm run dev
# or
node unified-server.js
```

This is a unified command that spins up both the frontend (Vite dev server) and the backend (Express API) in a single process. No need to run them separately.

## Usage Guide

### Adding a Habit
1. Go to the **Tracker** tab
2. Click **+ Add Habit** button
3. Enter a habit name in the modal dialog
4. Press Enter or click **Add Habit**

### Tracking Daily Progress
1. Select a date using the date picker (defaults to today)
2. For each habit, click **✓ Pass** or **✗ Fail**
3. Click **Save Entry** to save your progress
4. A confirmation message will appear briefly

### Using the Calendar View
- Each habit has its own calendar showing:
  - ✓ Green checkmark for passed days
  - ✗ Red X for failed days
  - Highlighted border for today
  - Empty cells for future dates
- Click any date in the calendar to load it in the tracker

### Viewing Statistics
1. Go to the **Statistics** tab
2. View success rate cards for each habit
3. Use **Chart Visibility** dropdown to toggle specific charts
4. Use **Period Toggle** to switch between weekly/monthly views

### Managing Diary Entries
1. Go to the **Diary** tab
2. Click **+ New** to create an entry for today
3. Or click any existing entry to edit
4. Add a title and your thoughts
5. Click **Save** to store your entry
6. Use **Delete** to remove entries

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

## Color System

Each habit is automatically assigned a unique color from the palette:
- 🟠 Orange (#c4763a)
- 🔵 Blue (#3a7cc4)
- 🟢 Green (#5aa36f)
- 🟣 Purple (#a574bc)
- 🔴 Red/Pink (#d97a6f)

Colors cycle if more than 5 habits are created.

## API Endpoints

- `GET /data` - Fetch all habit tracking data
- `POST /data` - Save habit tracking data
- `GET /diary` - Fetch all diary entries
- `POST /diary` - Save diary entries

## Development

### Running in Development Mode
```bash
# From root directory
npm run dev
```
This starts:
- Backend API on port 3001
- Vite dev server with hot reload on port 5173
- Unified access at http://localhost:3001

### Building for Production
```bash
npm run build
```
Creates an optimized production build in `habit-tracker-frontend/dist/`

### Running Production Server
```bash
npm start
```
Serves both the API and static files from port 3001

## Browser Support

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run dev
```

### TypeScript errors
```bash
cd habit-tracker-frontend
npm run build  # This will show all TypeScript errors
```

### Clear cache
```bash
cd habit-tracker-frontend
rm -rf node_modules/.vite
npm run dev
```

## Future Enhancements

- [ ] User authentication and multiple user support
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Data export (CSV/JSON)
- [ ] Habit reminders and notifications
- [ ] Mobile app with React Native
- [ ] Dark/light theme toggle
- [ ] Habit categories and tags
- [ ] Goal setting and progress milestones
- [ ] Social sharing features

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
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Icons and emojis for visual feedback
- Inspired by atomic habits and consistency tracking

---

**Built with discipline for building better habits** 🎯