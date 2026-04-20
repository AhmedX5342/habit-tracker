# Habit Tracker

A modern web-based application for tracking daily habits, visualizing progress, and maintaining streaks. Build and monitor multiple habits with an intuitive interface, comprehensive statistics, and historical tracking.

## Features

- **Dynamic Habit Management**: Add and delete habits on the fly. No predefined habits—start fresh and customize to your needs.
- **Daily Tracker**: Record pass/fail entries for each habit with a clean, intuitive interface.
- **Calendar View**: Visual calendar display for each habit showing daily results at a glance.
- **Streak Tracking**: Track current and best streaks for each habit with emoji indicators.
- **Multiple Chart Visualizations**: 
  - Success rate per week/month
  - Weekly/monthly fails breakdown
  - Cumulative success rate over time
  - 30-day rolling average
- **Period Toggles**: Switch between weekly and monthly views for all charts and statistics.
- **Chart Visibility Controls**: Show/hide specific charts with a dropdown menu.
- **Statistics Dashboard**: Real-time success rate cards with pass/fail counts.
- **Diary**: Journal entries linked to daily tracking with a dedicated diary sidebar.
- **Responsive Design**: Works seamlessly on desktop and tablet devices.

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charting**: Chart.js library for data visualization
- **Backend**: Node.js with Express.js
- **Data Storage**: JSON file-based persistence
- **Color System**: Dynamic 5-color palette for habits

## Getting Started

### Prerequisites
- Node.js (v14 or higher)

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

3. Start the server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:3001
```

## Usage

### Adding a Habit
1. Go to the **Habits** section
2. Click **Add Habit**
3. Enter a name and confirm

### Tracking Daily Progress
1. Go to the **Tracker** tab
2. Select the date (defaults to today)
3. For each habit, click **✓ Pass** or **✗ Fail**
4. Click **Save Entry**

### Viewing Statistics
1. Go to the **Statistics** tab
2. Use the **Chart Visibility** dropdown to toggle specific charts
3. Use the **Period Toggle** button to switch between weekly/monthly views

### Managing Diary Entries
1. Go to the **Diary** tab
2. Click **New Entry** or select an existing entry
3. Add title and notes
4. Click **Save**

## Project Structure

```
/
├── index.html        # Main UI layout
├── index.js          # Application logic and state management
├── server.js         # Express backend server
├── data.json         # Habit tracking data (auto-generated)
├── diary.json        # Diary entries (auto-generated)
├── package.json      # Project dependencies
└── README.md         # This file
```

## Data Format

### data.json
```json
{
  "habits": ["habit1", "habit2"],
  "entries": {
    "2026-04-20": {
      "habit1": 1,
      "habit2": 0
    }
  }
}
```

### diary.json
```json
{
  "2026-04-20": {
    "title": "Entry Title",
    "body": "Entry content..."
  }
}
```

## Color System

Each habit is automatically assigned a unique color from the palette:
- Orange (#c4763a)
- Blue (#3a7cc4)
- Green (#5aa36f)
- Purple (#a574bc)
- Red/Pink (#d97a6f)

Colors cycle if more than 5 habits are created.

## API Endpoints

- `GET /data` - Fetch all habit tracking data
- `POST /data` - Save habit tracking data
- `GET /diary` - Fetch all diary entries
- `POST /diary` - Save diary entries

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Feel free to fork, modify, and enhance this project!

---

Built with compassion for habit tracking and personal growth.
