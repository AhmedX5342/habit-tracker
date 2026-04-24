import { useState, useEffect } from 'react'
import { HabitData } from '../types'
import { todayStr, getHabitColor, computeStreaks } from '../utils/helpers'
import Calendar from './Calendar'

interface TrackerProps {
  data: HabitData
  onSave: (newData: HabitData) => Promise<void>
}

export default function Tracker({ data, onSave }: TrackerProps) {
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [trackerChoice, setTrackerChoice] = useState<Record<string, number | null>>({})
  const [showSaveMsg, setShowSaveMsg] = useState(false)
  const [showSaveMsgTimeout, setShowSaveMsgTimeout] = useState<number | null>(null)  // Changed from NodeJS.Timeout to number

  useEffect(() => {
    const entry = data.entries[selectedDate] || {}
    const newChoice: Record<string, number | null> = {}
    data.habits.forEach(h => {
      newChoice[h] = entry[h] !== undefined ? entry[h] : null
    })
    setTrackerChoice(newChoice)
  }, [selectedDate, data])

  const setChoice = (habit: string, value: number) => {
    setTrackerChoice(prev => ({ ...prev, [habit]: value }))
  }

  const saveSingleHabit = async (habit: string, value: number) => {
    // Update the choice first
    setChoice(habit, value)
    
    // Get all current choices
    const currentChoices = { ...trackerChoice, [habit]: value }
    
    // Save the entry (null values are allowed)
    const newData = {
      ...data,
      entries: { ...data.entries, [selectedDate]: { ...currentChoices } }
    }
    await onSave(newData)
    
    // Show save message
    if (showSaveMsgTimeout) clearTimeout(showSaveMsgTimeout)
    setShowSaveMsg(true)
    const timeout = setTimeout(() => setShowSaveMsg(false), 2000)
    setShowSaveMsgTimeout(timeout)
  }

  const saveAllHabits = async () => {
    // Check which habits are still null
    const nullHabits = data.habits.filter(h => trackerChoice[h] === null)
    
    if (nullHabits.length > 0) {
      const message = `You haven't set values for: ${nullHabits.join(', ')}.\n\nThese will remain as "unset". Continue?`
      if (!confirm(message)) return
    }
    
    const newData = {
      ...data,
      entries: { ...data.entries, [selectedDate]: { ...trackerChoice } }
    }
    await onSave(newData)
    
    if (showSaveMsgTimeout) clearTimeout(showSaveMsgTimeout)
    setShowSaveMsg(true)
    const timeout = setTimeout(() => setShowSaveMsg(false), 2000)
    setShowSaveMsgTimeout(timeout)
  }

  if (data.habits.length === 0) {
    return (
      <div className="tracker-panel">
        <p>No habits yet. Go to the Habit Manager tab to add some!</p>
      </div>
    )
  }

  return (
    <>
      <div className="section-label">Log Entry</div>
      <div className="tracker-panel">
        <div className="tracker-date-selector">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          <button className="today-btn" onClick={() => setSelectedDate(todayStr())}>Today</button>
        </div>
        <div className="tracker-rows">
          {data.habits.map(habit => {
            const color = getHabitColor(habit, data.habits)
            const label = habit.charAt(0).toUpperCase() + habit.slice(1)
            const choice = trackerChoice[habit]
            
            return (
              <div key={habit} className="tracker-row">
                <div className="tracker-label" style={{ color: color.text }}>
                  {label}
                </div>
                <div className="choice-btns">
                  <button 
                    className={`choice-btn ${choice === 1 ? 'selected-pass' : ''}`} 
                    onClick={() => saveSingleHabit(habit, 1)}
                  >
                    ✓ Pass
                  </button>
                  <button 
                    className={`choice-btn ${choice === 0 ? 'selected-fail' : ''}`} 
                    onClick={() => saveSingleHabit(habit, 0)}
                  >
                    ✗ Fail
                  </button>
                  <button 
                    className="choice-btn-unset"
                    onClick={() => saveSingleHabit(habit, null as any)}
                  >
                    ⊘ Unset
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="tracker-hint">
          💡 Changes are saved instantly when you click Pass/Fail/Unset
        </div>
      </div>

      <div id="tracker-streaks">
        {data.habits.map(habit => {
          const streaks = computeStreaks(data, habit)
          const color = getHabitColor(habit, data.habits)
          return (
            <div key={habit} className="streak-display" style={{ color: color.text }}>
              <span>🔥 {streaks.current} day streak</span>
              <span>Best: {streaks.best} days</span>
            </div>
          )
        })}
      </div>

      {/* Calendar View */}
      <Calendar data={data} onDateClick={(date) => setSelectedDate(date)} />
    </>
  )
}